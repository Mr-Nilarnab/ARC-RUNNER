import {
    BOOT_DURATION_MS,
    BOOT_LINES,
    MAX_BOOT_LOG_LINES,
} from "@/ts/core/constants/game.constants";
import type { ISoundEffects } from "@/ts/core/types/audio.types";
import type { DomElements } from "@/ts/ui/dom-elements";
import type { ScreenManager } from "@/ts/ui/screen-manager";

export interface BootSequenceOptions {
    readonly dom: DomElements;
    readonly screenManager: ScreenManager;
    readonly sfx: ISoundEffects;
}

export class BootSequence {
    private readonly dom: DomElements;
    private readonly screenManager: ScreenManager;
    private readonly sfx: ISoundEffects;
    private bootIndex = 0;
    private isBootDone = false;
    private rafId: number | null = null;
    private finishTimeoutId: ReturnType<typeof setTimeout> | null = null;

    public constructor(options: BootSequenceOptions) {
        this.dom = options.dom;
        this.screenManager = options.screenManager;
        this.sfx = options.sfx;
    }

    public isDone(): boolean {
        return this.isBootDone;
    }

    public start(startTs: number): void {
        this.cancelPendingFrames();

        const tick = (ts: number): void => {
            if (
                this.screenManager.getCurrentScreen() !== "boot" ||
                this.isBootDone
            ) {
                return;
            }

            const elapsed = ts - startTs;
            const pct = Math.min(100, (elapsed / BOOT_DURATION_MS) * 100);
            this.dom.bootBarFill.style.width = `${pct}%`;
            this.dom.bootPct.textContent = `${Math.floor(pct)}%`;

            const shouldShow = Math.floor(
                (elapsed / BOOT_DURATION_MS) * BOOT_LINES.length,
            );
            while (
                this.bootIndex <= shouldShow &&
                this.bootIndex < BOOT_LINES.length
            ) {
                const line = BOOT_LINES[this.bootIndex];
                if (line) {
                    this.addBootLine(line);
                }
                this.bootIndex++;
            }

            if (elapsed < BOOT_DURATION_MS) {
                this.rafId = requestAnimationFrame(tick);
            } else {
                this.finish();
            }
        };

        this.rafId = requestAnimationFrame(tick);
    }

    public skip(): void {
        if (
            this.screenManager.getCurrentScreen() !== "boot" ||
            this.isBootDone
        ) {
            return;
        }
        this.finish();
    }

    public finish(): void {
        if (this.isBootDone) return;
        this.isBootDone = true;
        this.cancelPendingFrames();

        while (this.bootIndex < BOOT_LINES.length) {
            const line = BOOT_LINES[this.bootIndex];
            if (line) {
                this.addBootLine(line);
            }
            this.bootIndex++;
        }

        this.dom.bootBarFill.style.width = "100%";
        this.dom.bootPct.textContent = "100%";

        if (this.finishTimeoutId !== null) {
            clearTimeout(this.finishTimeoutId);
        }

        this.finishTimeoutId = setTimeout(() => {
            this.screenManager.showScreen("menu");
            this.finishTimeoutId = null;
        }, 250);
    }

    public destroy(): void {
        this.cancelPendingFrames();
        if (this.finishTimeoutId !== null) {
            clearTimeout(this.finishTimeoutId);
            this.finishTimeoutId = null;
        }
    }

    private cancelPendingFrames(): void {
        if (this.rafId !== null) {
            cancelAnimationFrame(this.rafId);
            this.rafId = null;
        }
    }

    private addBootLine(text: string): void {
        const { bootLog } = this.dom;
        // Cap DOM growth: remove oldest lines if exceeding limit
        while (bootLog.childElementCount >= MAX_BOOT_LOG_LINES) {
            bootLog.firstChild?.remove();
        }
        const div = document.createElement("div");
        div.className = "boot-screen__log-entry";
        div.textContent = `> ${text}`;
        bootLog.appendChild(div);
        this.sfx.playBootBeep();
    }
}
