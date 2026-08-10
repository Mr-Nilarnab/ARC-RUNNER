import type { Particle } from "@/ts/core/types/entities.types";

export function createParticles(
    x: number,
    y: number,
    count: number,
    color = "#ff8752",
): Particle[] {
    const list: Particle[] = [];
    for (let i = 0; i < count; i++) {
        list.push({
            x,
            y,
            vx: (Math.random() - 0.5) * 2.2,
            vy: -Math.random() * 2.2,
            life: 300 + Math.random() * 200,
            maxLife: 500,
            color,
        });
    }
    return list;
}

export function spawnParticlesInto(
    target: Particle[],
    x: number,
    y: number,
    count: number,
    color = "#ff8752",
): void {
    for (let i = 0; i < count; i++) {
        target.push({
            x,
            y,
            vx: (Math.random() - 0.5) * 2.2,
            vy: -Math.random() * 2.2,
            life: 300 + Math.random() * 200,
            maxLife: 500,
            color,
        });
    }
}

export function updateParticlesInPlace(
    particles: Particle[],
    dt: number,
    k: number,
): void {
    let aliveCount = 0;
    for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        if (!p) continue;
        p.x += p.vx * k;
        p.y += p.vy * k;
        p.vy += 0.05 * k;
        p.life -= dt;
        if (p.life > 0) {
            particles[aliveCount++] = p;
        }
    }
    particles.length = aliveCount;
}

export function updateParticles(
    particles: ReadonlyArray<Particle>,
    dt: number,
    k: number,
): Particle[] {
    const alive: Particle[] = [];
    for (const p of particles) {
        p.x += p.vx * k;
        p.y += p.vy * k;
        p.vy += 0.05 * k;
        p.life -= dt;
        if (p.life > 0) {
            alive.push(p);
        }
    }
    return alive;
}
