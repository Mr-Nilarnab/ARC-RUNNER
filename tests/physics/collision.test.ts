import { describe, expect, test } from "bun:test";
import { checkCollision } from "@/ts/physics/collision";
import type { Player, Obstacle } from "@/ts/core/types/entities.types";
import {
    GROUND_Y,
    PLAYER_INITIAL_X,
    PLAYER_STAND_WIDTH,
    PLAYER_STAND_HEIGHT,
    PLAYER_DUCK_WIDTH,
    PLAYER_DUCK_HEIGHT,
    PLAYER_DUCK_OFFSET_X,
} from "@/ts/core/constants/game.constants";

function makePlayer(overrides: Partial<Player> = {}): Player {
    return {
        x: PLAYER_INITIAL_X,
        y: GROUND_Y - PLAYER_STAND_HEIGHT,
        w: PLAYER_STAND_WIDTH,
        h: PLAYER_STAND_HEIGHT,
        vy: 0,
        jumping: false,
        ducking: false,
        ...overrides,
    };
}

function makeObstacle(overrides: Partial<Obstacle> = {}): Obstacle {
    return {
        type: "ground",
        x: 200,
        y: GROUND_Y - 40,
        w: 20,
        h: 40,
        ...overrides,
    } as Obstacle;
}

describe("checkCollision", () => {
    test("no collision when far apart", () => {
        const p = makePlayer();
        const o = makeObstacle({ x: 500 });
        expect(checkCollision(p, o)).toBe(false);
    });

    test("collision when overlapping", () => {
        const p = makePlayer({ x: 190 });
        const o = makeObstacle({ x: 200, w: 20, y: GROUND_Y - 50, h: 50 });
        expect(checkCollision(p, o)).toBe(true);
    });

    test("no collision when just above obstacle", () => {
        const p = makePlayer({
            y: GROUND_Y - PLAYER_STAND_HEIGHT - 60,
            jumping: true,
        });
        const o = makeObstacle({
            x: PLAYER_INITIAL_X,
            y: GROUND_Y - 40,
            h: 40,
        });
        expect(checkCollision(p, o)).toBe(false);
    });

    test("no collision when obstacle just passed player", () => {
        const p = makePlayer();
        const o = makeObstacle({ x: PLAYER_INITIAL_X - 30, w: 20 });
        // obstacle right edge = 70 - 30 + 20 = 60, player left = 70
        expect(checkCollision(p, o)).toBe(false);
    });

    test("edge-touching is not a collision (AABB is exclusive)", () => {
        const p = makePlayer();
        // Place obstacle exactly at player right edge
        const o = makeObstacle({ x: PLAYER_INITIAL_X + PLAYER_STAND_WIDTH });
        expect(checkCollision(p, o)).toBe(false);
    });

    test("ducking player avoids air obstacle", () => {
        const p = makePlayer({ ducking: true });
        // Air obstacle sits at GROUND_Y - 67 with h=22, so bottom is at GROUND_Y - 45
        // Ducking player top is at GROUND_Y - 26 = 236, which is below 217
        const o = makeObstacle({
            type: "air",
            x: PLAYER_INITIAL_X - PLAYER_DUCK_OFFSET_X, // align with ducking hitbox
            y: GROUND_Y - 67,
            w: 34,
            h: 22,
        });
        expect(checkCollision(p, o)).toBe(false);
    });

    test("standing player hits air obstacle", () => {
        const p = makePlayer();
        // Place air obstacle overlapping standing player
        const o = makeObstacle({
            type: "air",
            x: PLAYER_INITIAL_X,
            y: GROUND_Y - 67,
            w: 34,
            h: 22,
        });
        // Standing player top: 262 - 50 = 212. Air obstacle bottom: 262-67+22 = 217.
        // 212 < 217 = overlap in Y. X also overlaps.
        expect(checkCollision(p, o)).toBe(true);
    });

    test("ducking shifts hitbox x by PLAYER_DUCK_OFFSET_X", () => {
        const p = makePlayer({ ducking: true });
        // Place obstacle that would miss the standing hitbox but hit the ducking hitbox
        // Ducking x = 70 - 8 = 62, width = 58, right = 120
        const o = makeObstacle({
            x: 63,
            w: 5,
            y: GROUND_Y - PLAYER_DUCK_HEIGHT,
            h: PLAYER_DUCK_HEIGHT,
        });
        expect(checkCollision(p, o)).toBe(true);
    });

    test("ducking changes hitbox height", () => {
        const p = makePlayer({ ducking: true });
        // Obstacle at player x, just above ducking height
        const o = makeObstacle({
            x: PLAYER_INITIAL_X,
            w: 20,
            y: GROUND_Y - PLAYER_DUCK_HEIGHT - 10,
            h: 5,
        });
        // Obstacle bottom: 236 - 10 + 5 = 231. Duck top: 236. No overlap.
        expect(checkCollision(p, o)).toBe(false);
    });
});
