import { AudioManager, AudioSynthesizer, SoundEffects } from "@/ts/audio";
import { GameEngine } from "@/ts/game";
import { InputHandler } from "@/ts/input";
import {
    BootSequence,
    HudManager,
    OverlayManager,
    ScreenManager,
    initDomElements,
} from "@/ts/ui";

function bootstrap(): void {
    const dom = initDomElements();
    const audio = new AudioManager();
    const synth = new AudioSynthesizer(audio);
    const sfx = new SoundEffects(synth);

    const screenManager = new ScreenManager(dom);
    const hudManager = new HudManager(dom);
    const overlayManager = new OverlayManager(dom);
    const bootSequence = new BootSequence({
        dom,
        screenManager,
        sfx,
    });

    const gameEngine = new GameEngine({
        dom,
        audio,
        sfx,
        screenManager,
        overlayManager,
        hudManager,
    });

    const inputHandler = new InputHandler({
        dom,
        audio,
        sfx,
        screenManager,
        bootSequence,
        gameEngine,
        hudManager,
    });

    inputHandler.bindEvents();
    screenManager.showScreen("boot");
    gameEngine.startLoop();
    bootSequence.start(performance.now());
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
        bootstrap();
    });
} else {
    bootstrap();
}
