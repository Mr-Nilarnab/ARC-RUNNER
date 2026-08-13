import { describe, expect, mock, test } from "bun:test";
import { GameEngine } from "@/ts/game/game-engine";
import type { ISoundEffects } from "@/ts/core/types";
import type { AudioManager } from "@/ts/audio";
import type { DomElements, HudManager, OverlayManager, ScreenManager } from "@/ts/ui";

function createMocks() {
    const sfx: ISoundEffects = {
        playClick: mock(() => {}),
        playStart: mock(() => {}),
        playJump: mock(() => {}),
        playDuck: mock(() => {}),
        playMilestone: mock(() => {}),
        playHit: mock(() => {}),
    };

    const audio = {
        ensureAudio: mock(() => {}),
        getContext: mock(() => null),
        getMuted: mock(() => false),
        toggleMute: mock(() => false),
    } as unknown as AudioManager;

    let currentScreen = "game";
    const screenManager = {
        showScreen: mock((screen: string) => {
            currentScreen = screen;
        }),
        getCurrentScreen: mock(() => currentScreen),
    } as unknown as ScreenManager;

    const overlayManager = {
        showReadyOverlay: mock(() => {}),
        showGameOverOverlay: mock(() => {}),
        hideOverlay: mock(() => {}),
        setPauseVisible: mock(() => {}),
        triggerHitEffect: mock(() => {}),
    } as unknown as OverlayManager;

    const hudManager = {
        updateStats: mock(() => {}),
        updateMuteState: mock(() => {}),
    } as unknown as HudManager;

    const dom = {
        ctx: {} as CanvasRenderingContext2D,
    } as unknown as DomElements;

    return { sfx, audio, screenManager, overlayManager, hudManager, dom };
}

describe("GameEngine Integration", () => {
    test("initial state is ready", () => {
        const mocks = createMocks();
        const engine = new GameEngine(mocks);
        expect(engine.getGameState()).toBe("ready");
    });

    test("startGame transitions state to playing and updates overlays", () => {
        const mocks = createMocks();
        const engine = new GameEngine(mocks);

        engine.startGame();

        expect(engine.getGameState()).toBe("playing");
        expect(mocks.audio.ensureAudio).toHaveBeenCalled();
        expect(mocks.sfx.playStart).toHaveBeenCalled();
        expect(mocks.overlayManager.hideOverlay).toHaveBeenCalled();
        expect(mocks.overlayManager.setPauseVisible).toHaveBeenCalledWith(false);
    });

    test("togglePause transitions between playing and paused", () => {
        const mocks = createMocks();
        const engine = new GameEngine(mocks);

        engine.startGame();
        expect(engine.getGameState()).toBe("playing");

        engine.togglePause();
        expect(engine.getGameState()).toBe("paused");
        expect(mocks.overlayManager.setPauseVisible).toHaveBeenCalledWith(true);

        engine.togglePause();
        expect(engine.getGameState()).toBe("playing");
        expect(mocks.overlayManager.setPauseVisible).toHaveBeenCalledWith(false);
    });

    test("endGame sets gameover state and particle effects", () => {
        const mocks = createMocks();
        const engine = new GameEngine(mocks);

        engine.startGame();
        engine.endGame();

        expect(engine.getGameState()).toBe("gameover");
        expect(mocks.sfx.playHit).toHaveBeenCalled();
        expect(mocks.overlayManager.triggerHitEffect).toHaveBeenCalled();
        expect(mocks.overlayManager.showGameOverOverlay).toHaveBeenCalled();
    });

    test("jump from ready state starts game", () => {
        const mocks = createMocks();
        const engine = new GameEngine(mocks);

        engine.jump();
        expect(engine.getGameState()).toBe("playing");
    });

    test("jump from paused state toggles pause", () => {
        const mocks = createMocks();
        const engine = new GameEngine(mocks);

        engine.startGame();
        engine.togglePause();
        expect(engine.getGameState()).toBe("paused");

        engine.jump();
        expect(engine.getGameState()).toBe("playing");
    });

    test("goToMenu navigates to menu screen", () => {
        const mocks = createMocks();
        const engine = new GameEngine(mocks);

        engine.goToMenu();
        expect(engine.getGameState()).toBe("ready");
        expect(mocks.screenManager.showScreen).toHaveBeenCalledWith("menu");
    });
});
