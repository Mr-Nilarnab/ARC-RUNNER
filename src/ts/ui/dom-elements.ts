import { getRequiredElement } from "@/ts/core/utils/dom.utils";

export interface DomElements {
    readonly canvas: HTMLCanvasElement;
    readonly ctx: CanvasRenderingContext2D;
    readonly viewport: HTMLElement;
    readonly hudTop: HTMLElement;
    readonly hudBottom: HTMLElement;
    readonly hitFlash: HTMLElement;
    readonly screens: {
        readonly boot: HTMLElement;
        readonly menu: HTMLElement;
        readonly exit: HTMLElement;
        readonly game: HTMLElement;
    };
    readonly bootLog: HTMLElement;
    readonly bootBarFill: HTMLElement;
    readonly bootPct: HTMLElement;
    readonly playBtn: HTMLButtonElement;
    readonly exitBtn: HTMLButtonElement;
    readonly reinitBtn: HTMLButtonElement;
    readonly overlay: HTMLElement;
    readonly overlayGlyph: HTMLElement;
    readonly overlayTitle: HTMLElement;
    readonly overlayDesc: HTMLElement;
    readonly primaryBtn: HTMLButtonElement;
    readonly overlayMenuBtn: HTMLButtonElement;
    readonly pauseOverlay: HTMLElement;
    readonly scoreEl: HTMLElement;
    readonly bestEl: HTMLElement;
    readonly speedEl: HTMLElement;
    readonly muteBtn: HTMLButtonElement;
    readonly muteVal: HTMLElement;
    readonly jumpBtn: HTMLButtonElement;
    readonly duckBtn: HTMLButtonElement;
}

export function initDomElements(): DomElements {
    const canvas = getRequiredElement<HTMLCanvasElement>("game");
    const ctx = canvas.getContext("2d");
    if (!ctx) {
        throw new Error("Could not acquire 2D context from canvas");
    }

    return {
        canvas,
        ctx,
        viewport: getRequiredElement<HTMLElement>("viewport"),
        hudTop: getRequiredElement<HTMLElement>("hudTop"),
        hudBottom: getRequiredElement<HTMLElement>("hudBottom"),
        hitFlash: getRequiredElement<HTMLElement>("hitFlash"),
        screens: {
            boot: getRequiredElement<HTMLElement>("screenBoot"),
            menu: getRequiredElement<HTMLElement>("screenMenu"),
            exit: getRequiredElement<HTMLElement>("screenExit"),
            game: getRequiredElement<HTMLElement>("screenGame"),
        },
        bootLog: getRequiredElement<HTMLElement>("bootLog"),
        bootBarFill: getRequiredElement<HTMLElement>("bootBarFill"),
        bootPct: getRequiredElement<HTMLElement>("bootPct"),
        playBtn: getRequiredElement<HTMLButtonElement>("playBtn"),
        exitBtn: getRequiredElement<HTMLButtonElement>("exitBtn"),
        reinitBtn: getRequiredElement<HTMLButtonElement>("reinitBtn"),
        overlay: getRequiredElement<HTMLElement>("overlay"),
        overlayGlyph: getRequiredElement<HTMLElement>("overlayGlyph"),
        overlayTitle: getRequiredElement<HTMLElement>("overlayTitle"),
        overlayDesc: getRequiredElement<HTMLElement>("overlayDesc"),
        primaryBtn: getRequiredElement<HTMLButtonElement>("primaryBtn"),
        overlayMenuBtn: getRequiredElement<HTMLButtonElement>("overlayMenuBtn"),
        pauseOverlay: getRequiredElement<HTMLElement>("pauseOverlay"),
        scoreEl: getRequiredElement<HTMLElement>("score"),
        bestEl: getRequiredElement<HTMLElement>("best"),
        speedEl: getRequiredElement<HTMLElement>("speedout"),
        muteBtn: getRequiredElement<HTMLButtonElement>("muteBtn"),
        muteVal: getRequiredElement<HTMLElement>("muteVal"),
        jumpBtn: getRequiredElement<HTMLButtonElement>("jumpBtn"),
        duckBtn: getRequiredElement<HTMLButtonElement>("duckBtn"),
    };
}
