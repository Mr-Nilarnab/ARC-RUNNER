import { describe, expect, test } from "bun:test";
import { clamp, safeFinite } from "@/ts/core/utils/math.utils";

describe("clamp", () => {
    test("returns value within range", () => {
        expect(clamp(5, 0, 10)).toBe(5);
    });

    test("clamps to min", () => {
        expect(clamp(-5, 0, 10)).toBe(0);
    });

    test("clamps to max", () => {
        expect(clamp(15, 0, 10)).toBe(10);
    });

    test("returns min for NaN", () => {
        expect(clamp(NaN, 0, 10)).toBe(0);
    });

    test("returns min for Infinity", () => {
        expect(clamp(Infinity, 0, 10)).toBe(0);
    });

    test("returns min for -Infinity", () => {
        expect(clamp(-Infinity, 0, 10)).toBe(0);
    });

    test("handles equal min and max", () => {
        expect(clamp(5, 3, 3)).toBe(3);
    });

    test("handles exact boundary values", () => {
        expect(clamp(0, 0, 10)).toBe(0);
        expect(clamp(10, 0, 10)).toBe(10);
    });
});

describe("safeFinite", () => {
    test("returns value when finite", () => {
        expect(safeFinite(42, 0)).toBe(42);
    });

    test("returns fallback for NaN", () => {
        expect(safeFinite(NaN, -1)).toBe(-1);
    });

    test("returns fallback for Infinity", () => {
        expect(safeFinite(Infinity, 0)).toBe(0);
    });

    test("returns fallback for -Infinity", () => {
        expect(safeFinite(-Infinity, 99)).toBe(99);
    });

    test("handles zero", () => {
        expect(safeFinite(0, 5)).toBe(0);
    });

    test("handles negative values", () => {
        expect(safeFinite(-3.14, 0)).toBe(-3.14);
    });
});
