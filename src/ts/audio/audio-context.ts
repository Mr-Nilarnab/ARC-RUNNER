interface WindowWithWebkitAudio extends Window {
    readonly webkitAudioContext?: typeof AudioContext;
}

export class AudioManager {
    private ctx: AudioContext | null = null;
    private isMuted = false;

    public ensureAudio(): void {
        if (!this.ctx) {
            try {
                const AudioCtxClass =
                    window.AudioContext ??
                    (window as WindowWithWebkitAudio).webkitAudioContext;
                if (AudioCtxClass) {
                    this.ctx = new AudioCtxClass();
                }
            } catch (err: unknown) {
                console.warn("Web Audio initialization error:", err);
                this.ctx = null;
            }
        }
        if (this.ctx?.state === "suspended") {
            void this.ctx.resume();
        }
    }

    public getContext(): AudioContext | null {
        return this.ctx;
    }

    public getMuted(): boolean {
        return this.isMuted;
    }

    public setMuted(muted: boolean): void {
        this.isMuted = muted;
    }

    public toggleMute(): boolean {
        this.isMuted = !this.isMuted;
        return this.isMuted;
    }

    public suspend(): void {
        if (this.ctx?.state === "running") {
            void this.ctx.suspend();
        }
    }

    public resume(): void {
        if (this.ctx?.state === "suspended") {
            void this.ctx.resume();
        }
    }
}
