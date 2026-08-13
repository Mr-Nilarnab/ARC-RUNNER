import { describe, expect, test } from "bun:test";
import {
    createObstacle,
    updateObstaclesInPlace,
} from "@/ts/entities/obstacles";
import { CANVAS_WIDTH, GROUND_Y } from "@/ts/core/constants/game.constants";
import type { Obstacle } from "@/ts/core/types/entities.types";

describe("createObstacle", () => {
    test("creates obstacle at correct x position", () => {
        const o = createObstacle();
        expect(o.x).toBe(CANVAS_WIDTH + 20);
    });

    test("creates valid obstacle type", () => {
        const o = createObstacle();
        expect(["air", "ground"]).toContain(o.type);
    });

    test("ground obstacle sits on ground line", () => {
        // Generate many obstacles to find a ground one
        for (let i = 0; i < 100; i++) {
            const o = createObstacle();
            if (o.type === "ground") {
                expect(o.y + o.h).toBeCloseTo(GROUND_Y, 0);
                expect(o.w).toBeGreaterThanOrEqual(18);
                expect(o.w).toBeLessThanOrEqual(34);
                expect(o.h).toBeGreaterThanOrEqual(30);
                expect(o.h).toBeLessThanOrEqual(52);
                return;
            }
        }
    });

    test("air obstacle has fixed dimensions", () => {
        for (let i = 0; i < 100; i++) {
            const o = createObstacle();
            if (o.type === "air") {
                expect(o.w).toBe(34);
                expect(o.h).toBe(22);
                expect(o.y).toBe(GROUND_Y - 67);
                return;
            }
        }
    });
});

describe("updateObstaclesInPlace", () => {
    test("moves obstacles left", () => {
        const obstacles: Obstacle[] = [createObstacle()];
        const startX = obstacles[0]!.x;
        updateObstaclesInPlace(obstacles, 6, 1);
        expect(obstacles[0]!.x).toBe(startX - 6);
    });

    test("removes off-screen obstacles", () => {
        const o = createObstacle();
        // Force obstacle far off-screen left
        (o as { x: number }).x = -100;
        const obstacles: Obstacle[] = [o];
        updateObstaclesInPlace(obstacles, 6, 1);
        expect(obstacles).toHaveLength(0);
    });

    test("preserves on-screen obstacles", () => {
        const obstacles: Obstacle[] = [createObstacle(), createObstacle()];
        updateObstaclesInPlace(obstacles, 6, 1);
        expect(obstacles).toHaveLength(2);
    });

    test("compacts array in-place", () => {
        const obstacles: Obstacle[] = [createObstacle(), createObstacle()];
        (obstacles[0] as { x: number }).x = -100; // mark first for removal
        updateObstaclesInPlace(obstacles, 6, 1);
        expect(obstacles).toHaveLength(1);
        expect(obstacles[0]!.x).toBeLessThan(CANVAS_WIDTH + 20); // it moved
    });

    test("handles empty array", () => {
        const obstacles: Obstacle[] = [];
        updateObstaclesInPlace(obstacles, 6, 1);
        expect(obstacles).toHaveLength(0);
    });

    test("respects k scaling", () => {
        const o1 = createObstacle();
        const o2 = createObstacle();
        const x1 = o1.x;
        const x2 = o2.x;

        updateObstaclesInPlace([o1], 6, 1);
        updateObstaclesInPlace([o2], 6, 2);

        expect(x1 - o1.x).toBeCloseTo(6, 5);
        expect(x2 - o2.x).toBeCloseTo(12, 5);
    });
});
