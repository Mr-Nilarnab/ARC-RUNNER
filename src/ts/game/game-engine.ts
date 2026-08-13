import { GROUND_Y } from "@/ts/core/constants";
import type { GameState, ISoundEffects } from "@/ts/core/types";
import type { AudioManager } from "@/ts/audio";
import {
    setPlayerDucking,
    spawnParticlesInto,
    triggerPlayerJump,
} from "@/ts/entities";
import type {
    DomElements,
    HudManager,
    OverlayManager,
    ScreenManager,
} from "@/ts/ui";
import { GameStateModel } from "@/ts/game/game-state";
import { GameLoop, type IGameLoop } from "@/ts/game/game-loop";
import {
    GameSimulation,
    type IGameSimulation,
} from "@/ts/game/game-simulation";
import { GameRenderer, type IGameRenderer } from "@/ts/game/game-renderer";

export interface GameEngineOptions {
    readonly dom: DomElements;
    readonly audio: AudioManager;
    readonly sfx: ISoundEffects;
    readonly screenManager: ScreenManager;
    readonly overlayManager: OverlayManager;
    readonly hudManager: HudManager;
    readonly simulation?: IGameSimulation;
    readonly renderer?: IGameRenderer;
    readonly loop?: IGameLoop;
    readonly state?: GameStateModel;
}

export class GameEngine {
    private readonly dom: DomElements;
    private readonly audio: AudioManager;
    private readonly sfx: ISoundEffects;
    private readonly screenManager: ScreenManager;
    private readonly overlayManager: OverlayManager;
    private readonly hudManager: HudManager;

    private readonly state: GameStateModel;
    private readonly simulation: IGameSimulation;
    private readonly renderer: IGameRenderer;
    private readonly loop: IGameLoop;

    private exitTimeoutId: ReturnType<typeof setTimeout> | null = null;

    public constructor(options: GameEngineOptions) {
        this.dom = options.dom;
        this.audio = options.audio;
        this.sfx = options.sfx;
        this.screenManager = options.screenManager;
        this.overlayManager = options.overlayManager;
        this.hudManager = options.hudManager;

        this.state = options.state ?? new GameStateModel();
        this.simulation =
            options.simulation ??
            new GameSimulation(this.sfx, {
                onGameOver: () => this.endGame(),
            });
        this.renderer =
            options.renderer ??
            new GameRenderer({
                dom: this.dom,
                hudManager: this.hudManager,
            });
        this.loop =
            options.loop ??
            new GameLoop({
                onUpdate: (dt: number) => this.handleUpdate(dt),
                onRender: () => this.handleRender(),
                onVisibilityChange: (hidden: boolean) =>
                    this.handleVisibilityChange(hidden),
            });
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
            this.loop.resetTiming();
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
        this.loop.start();
    }

    public stopLoop(): void {
        this.loop.stop();
    }

    public destroy(): void {
        this.loop.destroy();
        if (this.exitTimeoutId !== null) {
            clearTimeout(this.exitTimeoutId);
            this.exitTimeoutId = null;
        }
    }

    private handleVisibilityChange(hidden: boolean): void {
        if (hidden) {
            if (this.state.gameState === "playing") {
                this.state.gameState = "paused";
                this.overlayManager.setPauseVisible(true);
            }
            const ctx = this.audio.getContext();
            if (ctx?.state === "running") {
                void ctx.suspend();
            }
        } else {
            this.loop.resetTiming();
            if (!this.audio.getMuted()) {
                const ctx = this.audio.getContext();
                if (ctx?.state === "suspended") {
                    void ctx.resume();
                }
            }
        }
    }

    private handleUpdate(dt: number): void {
        if (
            this.screenManager.getCurrentScreen() === "game" &&
            this.state.gameState === "playing"
        ) {
            this.simulation.update(this.state, dt);
        }
    }

    private handleRender(): void {
        if (this.screenManager.getCurrentScreen() === "game") {
            this.renderer.render(this.state);
        }
    }
}
