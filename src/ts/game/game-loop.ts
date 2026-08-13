export interface GameLoopCallbacks {
    readonly onUpdate: (dt: number) => void;
    readonly onRender: () => void;
    readonly onVisibilityChange?: (hidden: boolean) => void;
}

export interface IGameLoop {
    start(): void;
    stop(): void;
    resetTiming(): void;
    destroy(): void;
}

export class GameLoop implements IGameLoop {
    private readonly callbacks: GameLoopCallbacks;
    private lastTime = 0;
    private animFrameId: number | null = null;
    private isRunning = false;
    private readonly boundVisibilityHandler: () => void;

    public constructor(callbacks: GameLoopCallbacks) {
        this.callbacks = callbacks;
        this.boundVisibilityHandler = this.handleVisibilityChange.bind(this);
    }

    public start(): void {
        this.stop();
        this.isRunning = true;
        this.lastTime = 0;
        if (typeof document !== "undefined") {
            document.addEventListener(
                "visibilitychange",
                this.boundVisibilityHandler,
            );
        }

        const loop = (ts: number): void => {
            if (!this.isRunning) return;

            if (!this.lastTime) this.lastTime = ts;
            const rawDt = ts - this.lastTime;
            // Clamp to prevent huge jumps after tab suspension
            const dt = Math.min(rawDt, 50);
            this.lastTime = ts;

            this.callbacks.onUpdate(dt);
            this.callbacks.onRender();

            if (typeof requestAnimationFrame !== "undefined") {
                this.animFrameId = requestAnimationFrame(loop);
            }
        };

        if (typeof requestAnimationFrame !== "undefined") {
            this.animFrameId = requestAnimationFrame(loop);
        }
    }

    public stop(): void {
        this.isRunning = false;
        if (this.animFrameId !== null) {
            if (typeof cancelAnimationFrame !== "undefined") {
                cancelAnimationFrame(this.animFrameId);
            }
            this.animFrameId = null;
        }
        if (typeof document !== "undefined") {
            document.removeEventListener(
                "visibilitychange",
                this.boundVisibilityHandler,
            );
        }
    }

    public resetTiming(): void {
        this.lastTime = 0;
    }

    public destroy(): void {
        this.stop();
    }

    private handleVisibilityChange(): void {
        const isHidden = typeof document !== "undefined" && document.hidden;
        if (!isHidden) {
            this.resetTiming();
        }
        if (this.callbacks.onVisibilityChange) {
            this.callbacks.onVisibilityChange(isHidden);
        }
    }
}
