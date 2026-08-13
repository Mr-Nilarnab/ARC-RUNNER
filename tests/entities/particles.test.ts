import { describe, expect, test } from "bun:test";
import {
    spawnParticlesInto,
    updateParticlesInPlace,
} from "@/ts/entities/particles";
import { MAX_PARTICLES } from "@/ts/core/constants/game.constants";
import type { Particle } from "@/ts/core/types/entities.types";

describe("spawnParticlesInto", () => {
    test("spawns requested count", () => {
        const target: Particle[] = [];
        spawnParticlesInto(target, 100, 200, 5);
        expect(target).toHaveLength(5);
    });

    test("uses correct position", () => {
        const target: Particle[] = [];
        spawnParticlesInto(target, 42, 84, 1);
        expect(target[0]!.x).toBe(42);
        expect(target[0]!.y).toBe(84);
    });

    test("uses default color", () => {
        const target: Particle[] = [];
        spawnParticlesInto(target, 0, 0, 1);
        expect(target[0]!.color).toBe("#ff8752");
    });

    test("uses custom color", () => {
        const target: Particle[] = [];
        spawnParticlesInto(target, 0, 0, 1, "#ff2b2b");
        expect(target[0]!.color).toBe("#ff2b2b");
    });

    test("enforces MAX_PARTICLES cap", () => {
        const target: Particle[] = [];
        // Fill to near capacity
        spawnParticlesInto(target, 0, 0, MAX_PARTICLES - 2);
        expect(target).toHaveLength(MAX_PARTICLES - 2);

        // Try to spawn 10 more — should only add 2
        spawnParticlesInto(target, 0, 0, 10);
        expect(target).toHaveLength(MAX_PARTICLES);
    });

    test("does nothing when already at cap", () => {
        const target: Particle[] = [];
        spawnParticlesInto(target, 0, 0, MAX_PARTICLES);
        const countBefore = target.length;
        spawnParticlesInto(target, 0, 0, 5);
        expect(target).toHaveLength(countBefore);
    });

    test("appends to existing particles", () => {
        const target: Particle[] = [];
        spawnParticlesInto(target, 0, 0, 3);
        spawnParticlesInto(target, 10, 10, 2);
        expect(target).toHaveLength(5);
        expect(target[3]!.x).toBe(10);
    });

    test("particle has positive life and maxLife", () => {
        const target: Particle[] = [];
        spawnParticlesInto(target, 0, 0, 1);
        expect(target[0]!.life).toBeGreaterThan(0);
        expect(target[0]!.maxLife).toBe(500);
    });
});

describe("updateParticlesInPlace", () => {
    test("removes dead particles", () => {
        const particles: Particle[] = [];
        spawnParticlesInto(particles, 0, 0, 5);
        // Kill all particles
        for (const p of particles) {
            p.life = 0;
        }
        updateParticlesInPlace(particles, 16, 1);
        expect(particles).toHaveLength(0);
    });

    test("keeps alive particles", () => {
        const particles: Particle[] = [];
        spawnParticlesInto(particles, 0, 0, 3);
        updateParticlesInPlace(particles, 1, 1); // tiny dt
        expect(particles.length).toBeGreaterThan(0);
    });

    test("applies gravity to vy", () => {
        const particles: Particle[] = [];
        spawnParticlesInto(particles, 0, 0, 1);
        const vyBefore = particles[0]!.vy;
        updateParticlesInPlace(particles, 1, 1);
        expect(particles[0]!.vy).toBeGreaterThan(vyBefore);
    });

    test("decreases life by dt", () => {
        const particles: Particle[] = [];
        spawnParticlesInto(particles, 0, 0, 1);
        const lifeBefore = particles[0]!.life;
        updateParticlesInPlace(particles, 50, 1);
        if (particles.length > 0) {
            expect(particles[0]!.life).toBe(lifeBefore - 50);
        }
    });

    test("handles empty array", () => {
        const particles: Particle[] = [];
        updateParticlesInPlace(particles, 16, 1);
        expect(particles).toHaveLength(0);
    });
});
