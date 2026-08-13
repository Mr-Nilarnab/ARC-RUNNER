import { describe, expect, test } from "bun:test";
import {
    createBackgroundDots,
    updateBackgroundDots,
} from "@/ts/entities/background-dots";
import {
    CANVAS_WIDTH,
    GROUND_Y,
    BG_DOTS_COUNT,
} from "@/ts/core/constants/game.constants";

describe("createBackgroundDots", () => {
    test("creates correct count", () => {
        const dots = createBackgroundDots();
        expect(dots).toHaveLength(BG_DOTS_COUNT);
    });

    test("dots are within canvas bounds", () => {
        const dots = createBackgroundDots();
        for (const d of dots) {
            expect(d.x).toBeGreaterThanOrEqual(0);
            expect(d.x).toBeLessThanOrEqual(CANVAS_WIDTH);
            expect(d.y).toBeGreaterThanOrEqual(20);
            expect(d.y).toBeLessThanOrEqual(GROUND_Y - 20);
            expect(d.s).toBeGreaterThan(0);
        }
    });
});

describe("updateBackgroundDots", () => {
    test("moves dots left", () => {
        const dots = createBackgroundDots();
        const initialPositions = dots.map((d) => d.x);
        updateBackgroundDots(dots, 6, 1);
        for (let i = 0; i < dots.length; i++) {
            expect(dots[i]!.x).toBeLessThan(initialPositions[i]!);
        }
    });

    test("wraps dots around screen", () => {
        const dots = createBackgroundDots();
        // Force a dot off-screen left
        dots[0]!.x = -5;
        updateBackgroundDots(dots, 6, 1);
        expect(dots[0]!.x).toBe(CANVAS_WIDTH + 4);
    });

    test("count stays constant", () => {
        const dots = createBackgroundDots();
        for (let i = 0; i < 1000; i++) {
            updateBackgroundDots(dots, 10, 1);
        }
        expect(dots).toHaveLength(BG_DOTS_COUNT);
    });
});
