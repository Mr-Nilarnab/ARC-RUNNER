import {
    BASE_DT,
    GROUND_Y,
    MAX_OBSTACLES,
    MAX_SCORE,
    MAX_SPEED,
    MILESTONE_INTERVAL,
    SCORE_FACTOR,
    SPEED_ACCELERATION,
} from "@/ts/core/constants";
import type { GameState, ISoundEffects } from "@/ts/core/types";
import type { AudioManager } from "@/ts/audio";
import {
    createObstacle,
    setPlayerDucking,
    spawnParticlesInto,
    triggerPlayerJump,
    updateBackgroundDots,
    updateObstaclesInPlace,
    updateParticlesInPlace,
    updatePlayerPhysics,
} from "@/ts/entities";
import {
    drawBackground,
    drawObstacle,
    drawParticles,
    drawPlayer,
} from "@/ts/graphics";
import { checkCollision } from "@/ts/physics";
import type {
    DomElements,
    HudManager,
    OverlayManager,
    ScreenManager,
} from "@/ts/ui";
import { GameStateModel } from "@/ts/game/game-state";

export interface GameEngineOptions {
    readonly dom: DomElements;
    readonly audio: AudioManager;
    readonly sfx: ISoundEffects;
    readonly screenManager: ScreenManager;
    readonly overlayManager: OverlayManager;
    readonly hudManager: HudManager;
}

export class GameEngine {
    private readonly dom: DomElements;
    private readonly audio: AudioManager;
    private readonly sfx: ISoundEffects;
    private readonly screenManager: ScreenManager;
    private readonly overlayManager: OverlayManager;
    private readonly hudManager: HudManager;

    private readonly state = new GameStateModel();
    private lastTime = 0;
    private animFrameId: number | null = null;
    private exitTimeoutId: ReturnType<typeof setTimeout> | null = null;
    private readonly boundVisibilityHandler: () => void;

    public constructor(options: GameEngineOptions) {
        this.dom = options.dom;
        this.audio = options.audio;
        this.sfx = options.sfx;
        this.screenManager = options.screenManager;
        this.overlayManager = options.overlayManager;
        this.hudManager = options.hudManager;
        this.boundVisibilityHandler = this.handleVisibilityChange.bind(this);
    }

    public getGameState(): GameState {
        return this.state.gameState;
    }

    public goPlay(): void {
        this.audio.ensureAudio();
        this.sfx.playClick();
        this.state.reset();
        this.state.gameState = "ready";
        this.overlayManager.showReadyOverlay();
        this.screenManager.showScreen("game");
    }

    public startGame(): void {
        this.audio.ensureAudio();
        this.sfx.playStart();
        this.state.reset();
        this.state.gameState = "playing";
        this.overlayManager.hideOverlay();
        this.overlayManager.setPauseVisible(false);
    }

    public endGame(): void {
        this.state.gameState = "gameover";
        this.state.best = Math.max(
            this.state.best,
            Math.floor(this.state.score),
        );
        spawnParticlesInto(
            this.state.particles,
            this.state.player.x + this.state.player.w / 2,
            this.state.player.y + this.state.player.h / 2,
            18,
            "#ff2b2b",
        );
        this.sfx.playHit();
        this.overlayManager.triggerHitEffect();
        this.overlayManager.showGameOverOverlay(this.state.score);
    }

    public goToMenu(): void {
        this.sfx.playClick();
        this.state.gameState = "ready";
        this.overlayManager.hideOverlay();
        this.overlayManager.setPauseVisible(false);
        this.screenManager.showScreen("menu");
    }

    public doExit(): void {
        this.audio.ensureAudio();
        this.sfx.playClick();
        this.screenManager.showScreen("exit");
        if (this.exitTimeoutId !== null) {
            clearTimeout(this.exitTimeoutId);
        }
        this.exitTimeoutId = setTimeout(() => {
            this.exitTimeoutId = null;
            try {
                window.close();
            } catch {
                /* browser may restrict window.close() */
            }
        }, 300);
    }

    public togglePause(): void {
        if (this.state.gameState === "playing") {
            this.state.gameState = "paused";
            this.overlayManager.setPauseVisible(true);
            this.sfx.playClick();
        } else if (this.state.gameState === "paused") {
            this.state.gameState = "playing";
            this.lastTime = 0; // Reset timing baseline on resume
            this.overlayManager.setPauseVisible(false);
            this.sfx.playClick();
        }
    }

    public jump(): void {
        if (this.screenManager.getCurrentScreen() !== "game") return;

        if (this.state.gameState === "paused") {
            this.togglePause();
            return;
        }

        if (
            this.state.gameState === "ready" ||
            this.state.gameState === "gameover"
        ) {
            this.startGame();
            return;
        }

        if (this.state.gameState === "playing") {
            const didJump = triggerPlayerJump(this.state.player);
            if (didJump) {
                this.sfx.playJump();
                spawnParticlesInto(
                    this.state.particles,
                    this.state.player.x + this.state.player.w / 2,
                    GROUND_Y,
                    5,
                    "#ff8752",
                );
            }
        }
    }

    public setDuck(down: boolean): void {
        if (
            this.screenManager.getCurrentScreen() !== "game" ||
            this.state.gameState !== "playing"
        ) {
            return;
        }

        const shouldPlayDuckSound = setPlayerDucking(this.state.player, down);
        if (shouldPlayDuckSound) {
            this.sfx.playDuck();
        }
    }

    public startLoop(): void {
        this.stopLoop();
        document.addEventListener(
            "visibilitychange",
            this.boundVisibilityHandler,
        );

        const loop = (ts: number): void => {
            if (!this.lastTime) this.lastTime = ts;
            const rawDt = ts - this.lastTime;
            // Clamp to prevent huge jumps after tab suspension
            const dt = Math.min(rawDt, 50);
            this.lastTime = ts;

            if (
                this.screenManager.getCurrentScreen() === "game" &&
                this.state.gameState === "playing"
            ) {
                this.update(dt);
            }

            if (this.screenManager.getCurrentScreen() === "game") {
                this.render();
            }

            this.animFrameId = requestAnimationFrame(loop);
        };

        this.animFrameId = requestAnimationFrame(loop);
    }

    public stopLoop(): void {
        if (this.animFrameId !== null) {
            cancelAnimationFrame(this.animFrameId);
            this.animFrameId = null;
        }
        document.removeEventListener(
            "visibilitychange",
            this.boundVisibilityHandler,
        );
    }

    public destroy(): void {
        this.stopLoop();
        if (this.exitTimeoutId !== null) {
            clearTimeout(this.exitTimeoutId);
            this.exitTimeoutId = null;
        }
    }

    private handleVisibilityChange(): void {
        if (document.hidden) {
            // Pause gameplay when tab is hidden to prevent physics explosion
            if (this.state.gameState === "playing") {
                this.state.gameState = "paused";
                this.overlayManager.setPauseVisible(true);
            }
            // Suspend audio to free resources
            const ctx = this.audio.getContext();
            if (ctx?.state === "running") {
                void ctx.suspend();
            }
        } else {
            // Reset timing baseline to avoid giant dt on resume
            this.lastTime = 0;
            // Resume audio if not muted
            if (!this.audio.getMuted()) {
                const ctx = this.audio.getContext();
                if (ctx?.state === "suspended") {
                    void ctx.resume();
                }
            }
        }
    }

    private update(dt: number): void {
        const k = dt / BASE_DT;
        this.updateProgression(k);
        this.updateSpawner(dt);
        this.updateEntities(dt, k);
        this.checkCollisions();
    }

    private updateProgression(k: number): void {
        this.state.frame++;
        this.state.score = Math.min(
            MAX_SCORE,
            this.state.score + k * (this.state.speed / 6) * SCORE_FACTOR,
        );
        this.state.speed = Math.min(
            MAX_SPEED,
            6 + this.state.score * SPEED_ACCELERATION,
        );

        const milestone = Math.floor(this.state.score / MILESTONE_INTERVAL);
        if (milestone > this.state.lastMilestone) {
            this.state.lastMilestone = milestone;
            this.sfx.playMilestone();
        }
    }

    private updateSpawner(dt: number): void {
        this.state.spawnTimer += dt;
        if (this.state.spawnTimer > this.state.nextSpawn) {
            this.state.spawnTimer = 0;
            this.state.nextSpawn = Math.max(
                600,
                1250 - this.state.speed * 32 + Math.random() * 450,
            );
            // Enforce hard obstacle cap
            if (this.state.obstacles.length < MAX_OBSTACLES) {
                this.state.obstacles.push(createObstacle());
            }
        }
    }

    private updateEntities(dt: number, k: number): void {
        updatePlayerPhysics(this.state.player, k);
        updateObstaclesInPlace(this.state.obstacles, this.state.speed, k);
        updateBackgroundDots(this.state.bgDots, this.state.speed, k);
        updateParticlesInPlace(this.state.particles, dt, k);
    }

    private checkCollisions(): void {
        for (const o of this.state.obstacles) {
            if (checkCollision(this.state.player, o)) {
                this.endGame();
                break;
            }
        }
    }

    private render(): void {
        const { ctx } = this.dom;
        drawBackground(
            ctx,
            this.state.bgDots,
            this.state.frame,
            this.state.speed,
        );
        for (const obstacle of this.state.obstacles) {
            drawObstacle(ctx, obstacle, this.state.frame);
        }
        drawParticles(ctx, this.state.particles);
        drawPlayer(ctx, this.state.player, this.state.frame);
        this.hudManager.updateStats(
            this.state.score,
            this.state.best,
            this.state.speed,
        );
    }
}
