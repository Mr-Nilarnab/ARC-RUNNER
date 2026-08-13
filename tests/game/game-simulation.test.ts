import { describe, expect, mock, test } from "bun:test";
import { GameSimulation } from "@/ts/game/game-simulation";
import { GameStateModel } from "@/ts/game/game-state";
import { INITIAL_SPEED, MILESTONE_INTERVAL } from "@/ts/core/constants";
import type { ISoundEffects } from "@/ts/core/types";

function createMockSfx(): ISoundEffects {
    return {
        playClick: mock(() => {}),
        playStart: mock(() => {}),
        playJump: mock(() => {}),
        playDuck: mock(() => {}),
        playMilestone: mock(() => {}),
        playHit: mock(() => {}),
    };
}

describe("GameSimulation", () => {
    test("score and speed progress on update", () => {
        const state = new GameStateModel();
        const sfx = createMockSfx();
        const onGameOver = mock(() => {});
        const sim = new GameSimulation(sfx, { onGameOver });

        state.gameState = "playing";
        sim.update(state, 16.6); // ~1 frame at 60fps

        expect(state.frame).toBe(1);
        expect(state.score).toBeGreaterThan(0);
        expect(state.speed).toBeGreaterThanOrEqual(INITIAL_SPEED);
        expect(onGameOver).not.toHaveBeenCalled();
    });

    test("triggers milestone sound when score crosses interval", () => {
        const state = new GameStateModel();
        const sfx = createMockSfx();
        const sim = new GameSimulation(sfx, { onGameOver: mock(() => {}) });

        // Manually set score just below milestone
        state.score = MILESTONE_INTERVAL - 0.01;
        state.speed = 6;
        sim.update(state, 100);

        expect(state.score).toBeGreaterThanOrEqual(MILESTONE_INTERVAL);
        expect(sfx.playMilestone).toHaveBeenCalled();
    });

    test("spawns obstacles over time", () => {
        const state = new GameStateModel();
        const sfx = createMockSfx();
        const sim = new GameSimulation(sfx, { onGameOver: mock(() => {}) });

        state.spawnTimer = 2000;
        state.nextSpawn = 1000;

        sim.update(state, 16.6);

        expect(state.obstacles.length).toBe(1);
        expect(state.spawnTimer).toBe(0);
    });

    test("triggers onGameOver callback on collision", () => {
        const state = new GameStateModel();
        const sfx = createMockSfx();
        const onGameOver = mock(() => {});
        const sim = new GameSimulation(sfx, { onGameOver });

        // Place obstacle directly overlapping player
        state.obstacles.push({
            x: state.player.x,
            y: state.player.y,
            w: 30,
            h: 30,
            type: "cactus",
            passed: false,
        });

        sim.update(state, 16.6);

        expect(onGameOver).toHaveBeenCalled();
    });
});
