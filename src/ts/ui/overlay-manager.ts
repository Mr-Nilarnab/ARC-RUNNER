import type { DomElements } from "@/ts/ui/dom-elements";

export class OverlayManager {
    public constructor(private readonly dom: DomElements) {}

    public showReadyOverlay(): void {
        const {
            overlayGlyph,
            overlayTitle,
            overlayDesc,
            primaryBtn,
            overlay,
            pauseOverlay,
        } = this.dom;

        overlayGlyph.textContent = "⬡";
        overlayTitle.textContent = "UNIT READY";
        overlayDesc.textContent =
            "Arc-core evasion unit online. Clear the hazard grid — jump the stacks, duck the drones.";
        primaryBtn.textContent = "ENGAGE";

        overlay.classList.remove("overlay--hidden");
        overlay.setAttribute("aria-hidden", "false");

        pauseOverlay.classList.add("overlay--hidden");
        pauseOverlay.setAttribute("aria-hidden", "true");
    }

    public showGameOverOverlay(score: number): void {
        const { overlayGlyph, overlayTitle, overlayDesc, primaryBtn, overlay } =
            this.dom;

        overlayGlyph.textContent = "⬢";
        overlayTitle.textContent = "CORE BREACH";
        overlayDesc.textContent = `Unit disabled at ${Math.floor(score)}m. Recalibrate and relaunch.`;
        primaryBtn.textContent = "RELAUNCH";

        overlay.classList.remove("overlay--hidden");
        overlay.setAttribute("aria-hidden", "false");
    }

    public hideOverlay(): void {
        this.dom.overlay.classList.add("overlay--hidden");
        this.dom.overlay.setAttribute("aria-hidden", "true");
    }

    public setPauseVisible(visible: boolean): void {
        this.dom.pauseOverlay.classList.toggle("overlay--hidden", !visible);
        this.dom.pauseOverlay.setAttribute("aria-hidden", String(!visible));
    }

    public triggerHitEffect(): void {
        const { viewport, hitFlash } = this.dom;

        viewport.classList.remove("viewport--shake");
        void viewport.offsetWidth;
        viewport.classList.add("viewport--shake");

        hitFlash.classList.remove("viewport__hit-flash--active");
        void hitFlash.offsetWidth;
        hitFlash.classList.add("viewport__hit-flash--active");
    }
}
