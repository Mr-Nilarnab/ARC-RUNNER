import { describe, expect, test } from "bun:test";
import { GameStateModel } from "@/ts/game/game-state";
import { INITIAL_SPEED } from "@/ts/core/constants/game.constants";
import type { GameState } from "@/ts/core/types/app.types";

describe("GameStateModel", () => {
    test("initializes with correct defaults", () => {
        const state = new GameStateModel();
        expect(state.score).toBe(0);
        expect(state.best).toBe(0);
        expect(state.speed).toBe(INITIAL_SPEED);
        expect(state.frame).toBe(0);
        expect(state.lastMilestone).toBe(0);
        expect(state.spawnTimer).toBe(0);
        expect(state.nextSpawn).toBe(1000);
        expect(state.gameState).toBe("ready");
    });

    test("player is initialized", () => {
        const state = new GameStateModel();
        expect(state.player).toBeDefined();
        expect(state.player.x).toBe(70);
    });

    test("arrays are initialized", () => {
        const state = new GameStateModel();
        expect(Array.isArray(state.obstacles)).toBe(true);
        expect(Array.isArray(state.particles)).toBe(true);
        expect(Array.isArray(state.bgDots)).toBe(true);
        expect(state.obstacles).toHaveLength(0);
        expect(state.particles).toHaveLength(0);
        expect(state.bgDots.length).toBeGreaterThan(0);
    });

    describe("gameState setter validation", () => {
        test("accepts valid states", () => {
            const state = new GameStateModel();
            const validStates: GameState[] = [
                "ready",
                "playing",
                "paused",
                "gameover",
            ];
            for (const s of validStates) {
                state.gameState = s;
                expect(state.gameState).toBe(s);
            }
        });

        test("rejects invalid state strings", () => {
            const state = new GameStateModel();
            state.gameState = "playing";
            // Force an invalid value through the setter
            state.gameState = "invalid" as GameState;
            // Should remain at previous valid state
            expect(state.gameState).toBe("playing");
        });
    });

    describe("reset", () => {
        test("resets score and speed", () => {
            const state = new GameStateModel();
            state.score = 5000;
            state.speed = 14;
            state.frame = 999;
            state.lastMilestone = 10;
            state.spawnTimer = 500;
            state.reset();
            expect(state.score).toBe(0);
            expect(state.speed).toBe(INITIAL_SPEED);
            expect(state.frame).toBe(0);
            expect(state.lastMilestone).toBe(0);
            expect(state.spawnTimer).toBe(0);
        });

        test("reuses obstacle array (same reference)", () => {
            const state = new GameStateModel();
            const obstaclesRef = state.obstacles;
            state.reset();
            expect(state.obstacles).toBe(obstaclesRef);
            expect(state.obstacles).toHaveLength(0);
        });

        test("reuses particle array (same reference)", () => {
            const state = new GameStateModel();
            const particlesRef = state.particles;
            state.reset();
            expect(state.particles).toBe(particlesRef);
            expect(state.particles).toHaveLength(0);
        });

        test("creates fresh player", () => {
            const state = new GameStateModel();
            const oldPlayer = state.player;
            state.player.x = 999;
            state.reset();
            expect(state.player).not.toBe(oldPlayer);
            expect(state.player.x).toBe(70);
        });

        test("preserves best score across reset", () => {
            const state = new GameStateModel();
            state.best = 9999;
            state.reset();
            expect(state.best).toBe(9999);
        });
    });
});
