import { describe, expect, test } from "bun:test";
import {
    createPlayer,
    updatePlayerPhysics,
    triggerPlayerJump,
    setPlayerDucking,
} from "@/ts/entities/player";
import {
    GROUND_Y,
    PLAYER_INITIAL_X,
    PLAYER_STAND_WIDTH,
    PLAYER_STAND_HEIGHT,
    JUMP_FORCE,
    GRAVITY,
} from "@/ts/core/constants/game.constants";

describe("createPlayer", () => {
    test("returns player at correct initial position", () => {
        const p = createPlayer();
        expect(p.x).toBe(PLAYER_INITIAL_X);
        expect(p.y).toBe(GROUND_Y - PLAYER_STAND_HEIGHT);
        expect(p.w).toBe(PLAYER_STAND_WIDTH);
        expect(p.h).toBe(PLAYER_STAND_HEIGHT);
        expect(p.vy).toBe(0);
        expect(p.jumping).toBe(false);
        expect(p.ducking).toBe(false);
    });

    test("returns a fresh object each call", () => {
        const a = createPlayer();
        const b = createPlayer();
        expect(a).not.toBe(b);
        expect(a).toEqual(b);
    });
});

describe("updatePlayerPhysics", () => {
    test("does nothing when not jumping", () => {
        const p = createPlayer();
        const yBefore = p.y;
        updatePlayerPhysics(p, 1);
        expect(p.y).toBe(yBefore);
        expect(p.vy).toBe(0);
    });

    test("applies gravity when jumping", () => {
        const p = createPlayer();
        p.jumping = true;
        p.vy = JUMP_FORCE;
        updatePlayerPhysics(p, 1);
        expect(p.vy).toBeCloseTo(JUMP_FORCE + GRAVITY, 5);
        expect(p.y).toBeLessThan(GROUND_Y - PLAYER_STAND_HEIGHT);
    });

    test("snaps to ground and stops jumping", () => {
        const p = createPlayer();
        p.jumping = true;
        p.vy = 20; // falling fast
        p.y = GROUND_Y - PLAYER_STAND_HEIGHT - 1; // just above ground
        updatePlayerPhysics(p, 1);
        expect(p.y).toBe(GROUND_Y - PLAYER_STAND_HEIGHT);
        expect(p.jumping).toBe(false);
        expect(p.vy).toBe(0);
    });

    test("recovers from NaN y-position", () => {
        const p = createPlayer();
        p.jumping = true;
        p.y = NaN;
        p.vy = 5;
        updatePlayerPhysics(p, 1);
        expect(p.y).toBe(GROUND_Y - PLAYER_STAND_HEIGHT);
        expect(p.jumping).toBe(false);
    });

    test("respects k scaling factor", () => {
        const p1 = createPlayer();
        p1.jumping = true;
        p1.vy = JUMP_FORCE;

        const p2 = createPlayer();
        p2.jumping = true;
        p2.vy = JUMP_FORCE;

        updatePlayerPhysics(p1, 1);
        updatePlayerPhysics(p2, 2);

        // Higher k = more gravity applied
        expect(p2.vy).toBeGreaterThan(p1.vy);
    });
});

describe("triggerPlayerJump", () => {
    test("initiates jump from ground", () => {
        const p = createPlayer();
        const result = triggerPlayerJump(p);
        expect(result).toBe(true);
        expect(p.jumping).toBe(true);
        expect(p.vy).toBe(JUMP_FORCE);
    });

    test("rejects double jump", () => {
        const p = createPlayer();
        triggerPlayerJump(p);
        const result = triggerPlayerJump(p);
        expect(result).toBe(false);
    });

    test("rejects jump while ducking", () => {
        const p = createPlayer();
        p.ducking = true;
        const result = triggerPlayerJump(p);
        expect(result).toBe(false);
        expect(p.jumping).toBe(false);
    });
});

describe("setPlayerDucking", () => {
    test("starts ducking on ground", () => {
        const p = createPlayer();
        const soundTriggered = setPlayerDucking(p, true);
        expect(p.ducking).toBe(true);
        expect(soundTriggered).toBe(true);
    });

    test("does not trigger sound when already ducking", () => {
        const p = createPlayer();
        setPlayerDucking(p, true);
        const soundTriggered = setPlayerDucking(p, true);
        expect(soundTriggered).toBe(false);
    });

    test("stops ducking", () => {
        const p = createPlayer();
        setPlayerDucking(p, true);
        const soundTriggered = setPlayerDucking(p, false);
        expect(p.ducking).toBe(false);
        expect(soundTriggered).toBe(false);
    });

    test("rejects ducking while jumping", () => {
        const p = createPlayer();
        p.jumping = true;
        const soundTriggered = setPlayerDucking(p, true);
        expect(p.ducking).toBe(false);
        expect(soundTriggered).toBe(false);
    });

    test("force-releases duck even mid-air", () => {
        const p = createPlayer();
        setPlayerDucking(p, true);
        p.jumping = true; // somehow ended up jumping while ducking
        setPlayerDucking(p, false);
        expect(p.ducking).toBe(false);
    });
});
