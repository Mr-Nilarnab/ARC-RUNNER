import { describe, expect, test } from "bun:test";
import { createSeededRandom, createMathRandom } from "@/ts/core/utils/random";

describe("createSeededRandom", () => {
    test("produces deterministic sequence", () => {
        const rng1 = createSeededRandom(12345);
        const rng2 = createSeededRandom(12345);
        for (let i = 0; i < 100; i++) {
            expect(rng1.next()).toBe(rng2.next());
        }
    });

    test("different seeds produce different sequences", () => {
        const rng1 = createSeededRandom(1);
        const rng2 = createSeededRandom(2);
        // At least one of the first 10 values should differ
        let allSame = true;
        for (let i = 0; i < 10; i++) {
            if (rng1.next() !== rng2.next()) {
                allSame = false;
                break;
            }
        }
        expect(allSame).toBe(false);
    });

    test("next() returns values in [0, 1)", () => {
        const rng = createSeededRandom(42);
        for (let i = 0; i < 1000; i++) {
            const v = rng.next();
            expect(v).toBeGreaterThanOrEqual(0);
            expect(v).toBeLessThan(1);
        }
    });

    test("nextRange returns values in [min, max)", () => {
        const rng = createSeededRandom(99);
        for (let i = 0; i < 500; i++) {
            const v = rng.nextRange(5, 10);
            expect(v).toBeGreaterThanOrEqual(5);
            expect(v).toBeLessThan(10);
        }
    });

    test("nextInt returns integers in [min, max)", () => {
        const rng = createSeededRandom(77);
        for (let i = 0; i < 500; i++) {
            const v = rng.nextInt(0, 5);
            expect(v).toBeGreaterThanOrEqual(0);
            expect(v).toBeLessThan(5);
            expect(Number.isInteger(v)).toBe(true);
        }
    });
});

describe("createMathRandom", () => {
    test("next() returns values in [0, 1)", () => {
        const rng = createMathRandom();
        for (let i = 0; i < 100; i++) {
            const v = rng.next();
            expect(v).toBeGreaterThanOrEqual(0);
            expect(v).toBeLessThan(1);
        }
    });

    test("nextRange returns values in range", () => {
        const rng = createMathRandom();
        for (let i = 0; i < 100; i++) {
            const v = rng.nextRange(-10, 10);
            expect(v).toBeGreaterThanOrEqual(-10);
            expect(v).toBeLessThan(10);
        }
    });

    test("nextInt returns integers", () => {
        const rng = createMathRandom();
        for (let i = 0; i < 100; i++) {
            const v = rng.nextInt(0, 100);
            expect(Number.isInteger(v)).toBe(true);
        }
    });
});
