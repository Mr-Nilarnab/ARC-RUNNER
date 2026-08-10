import type { DomElements } from "@/ts/ui/dom-elements";

export class HudManager {
    public constructor(private readonly dom: DomElements) {}

    public updateStats(score: number, best: number, speed: number): void {
        const { scoreEl, bestEl, speedEl } = this.dom;
        scoreEl.textContent = String(Math.floor(score)).padStart(5, "0");
        bestEl.textContent = String(best).padStart(5, "0");
        speedEl.textContent = `${(speed / 6).toFixed(1)}x`;
    }

    public updateMuteState(isMuted: boolean): void {
        this.dom.muteVal.textContent = isMuted ? "OFF" : "ON";
    }
}
