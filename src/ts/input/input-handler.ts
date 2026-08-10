import { isButtonTarget } from "@/ts/core/utils";
import type { ISoundEffects } from "@/ts/core/types";
import type { AudioManager } from "@/ts/audio";
import type { GameEngine } from "@/ts/game";
import type {
    BootSequence,
    DomElements,
    HudManager,
    ScreenManager,
} from "@/ts/ui";

export interface InputHandlerOptions {
    readonly dom: DomElements;
    readonly audio: AudioManager;
    readonly sfx: ISoundEffects;
    readonly screenManager: ScreenManager;
    readonly bootSequence: BootSequence;
    readonly gameEngine: GameEngine;
    readonly hudManager: HudManager;
}

export class InputHandler {
    private readonly dom: DomElements;
    private readonly audio: AudioManager;
    private readonly sfx: ISoundEffects;
    private readonly screenManager: ScreenManager;
    private readonly bootSequence: BootSequence;
    private readonly gameEngine: GameEngine;
    private readonly hudManager: HudManager;

    private abortController: AbortController | null = null;

    public constructor(options: InputHandlerOptions) {
        this.dom = options.dom;
        this.audio = options.audio;
        this.sfx = options.sfx;
        this.screenManager = options.screenManager;
        this.bootSequence = options.bootSequence;
        this.gameEngine = options.gameEngine;
        this.hudManager = options.hudManager;
    }

    public bindEvents(): void {
        this.unbind();
        this.abortController = new AbortController();
        const signal = this.abortController.signal;

        this.bindKeyboard(signal);
        this.bindViewport(signal);
        this.bindTouchControls(signal);
        this.bindActionButtons(signal);
    }

    public unbind(): void {
        if (this.abortController) {
            this.abortController.abort();
            this.abortController = null;
        }
    }

    private bindKeyboard(signal: AbortSignal): void {
        window.addEventListener(
            "keydown",
            (e: KeyboardEvent) => {
                this.handleKeyDown(e);
            },
            { signal },
        );

        window.addEventListener(
            "keyup",
            (e: KeyboardEvent) => {
                if (e.code === "ArrowDown" || e.code === "KeyS") {
                    this.gameEngine.setDuck(false);
                }
            },
            { signal },
        );
    }

    private handleKeyDown(e: KeyboardEvent): void {
        this.audio.ensureAudio();
        const appState = this.screenManager.getCurrentScreen();

        if (appState === "boot") {
            this.bootSequence.skip();
            return;
        }

        if (appState === "menu") {
            if (e.code === "Space" || e.code === "Enter") {
                e.preventDefault();
                this.gameEngine.goPlay();
            }
            return;
        }

        if (appState === "exit") return;

        this.handleGameKeyDown(e);
    }

    private handleGameKeyDown(e: KeyboardEvent): void {
        const gameState = this.gameEngine.getGameState();

        if (e.code === "Space" || e.code === "ArrowUp") {
            e.preventDefault();
            this.gameEngine.jump();
        } else if (e.code === "ArrowDown" || e.code === "KeyS") {
            e.preventDefault();
            this.gameEngine.setDuck(true);
        } else if (e.code === "KeyR") {
            if (gameState !== "ready") {
                this.gameEngine.startGame();
            }
        } else if (e.code === "KeyP") {
            this.gameEngine.togglePause();
        } else if (e.code === "Escape") {
            if (
                gameState === "paused" ||
                gameState === "ready" ||
                gameState === "gameover"
            ) {
                this.gameEngine.goToMenu();
            }
        }
    }

    private bindViewport(signal: AbortSignal): void {
        const handlePointer = (e: Event): void => {
            this.audio.ensureAudio();
            if (isButtonTarget(e.target)) return;

            if (this.screenManager.getCurrentScreen() === "boot") {
                this.bootSequence.skip();
                return;
            }

            this.gameEngine.jump();
        };

        this.dom.viewport.addEventListener("mousedown", handlePointer, {
            signal,
        });
        this.dom.viewport.addEventListener("touchstart", handlePointer, {
            passive: true,
            signal,
        });
    }

    private bindTouchControls(signal: AbortSignal): void {
        const { jumpBtn, duckBtn } = this.dom;

        jumpBtn.addEventListener(
            "click",
            () => {
                this.gameEngine.jump();
            },
            { signal },
        );

        duckBtn.addEventListener(
            "touchstart",
            (e: TouchEvent) => {
                e.preventDefault();
                this.gameEngine.setDuck(true);
            },
            { passive: false, signal },
        );

        duckBtn.addEventListener(
            "touchend",
            (e: TouchEvent) => {
                e.preventDefault();
                this.gameEngine.setDuck(false);
            },
            { passive: false, signal },
        );

        duckBtn.addEventListener(
            "mousedown",
            () => {
                this.gameEngine.setDuck(true);
            },
            { signal },
        );
        duckBtn.addEventListener(
            "mouseup",
            () => {
                this.gameEngine.setDuck(false);
            },
            { signal },
        );
        duckBtn.addEventListener(
            "mouseleave",
            () => {
                this.gameEngine.setDuck(false);
            },
            { signal },
        );
    }

    private bindActionButtons(signal: AbortSignal): void {
        const {
            playBtn,
            exitBtn,
            reinitBtn,
            primaryBtn,
            overlayMenuBtn,
            muteBtn,
        } = this.dom;

        playBtn.addEventListener(
            "click",
            () => {
                this.gameEngine.goPlay();
            },
            { signal },
        );

        exitBtn.addEventListener(
            "click",
            () => {
                this.gameEngine.doExit();
            },
            { signal },
        );

        reinitBtn.addEventListener(
            "click",
            () => {
                this.sfx.playClick();
                this.screenManager.showScreen("menu");
            },
            { signal },
        );

        primaryBtn.addEventListener(
            "click",
            () => {
                this.gameEngine.startGame();
            },
            { signal },
        );

        overlayMenuBtn.addEventListener(
            "click",
            () => {
                this.gameEngine.goToMenu();
            },
            { signal },
        );

        muteBtn.addEventListener(
            "click",
            () => {
                const isMuted = this.audio.toggleMute();
                this.hudManager.updateMuteState(isMuted);
                if (!isMuted) {
                    this.audio.ensureAudio();
                    this.sfx.playClick();
                }
            },
            { signal },
        );
    }
}
