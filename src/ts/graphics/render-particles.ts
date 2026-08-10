import type { Particle } from "@/ts/core/types/entities.types";

export function drawParticles(
    ctx: CanvasRenderingContext2D,
    particles: ReadonlyArray<Particle>,
): void {
    for (const p of particles) {
        const a = Math.max(0, p.life / p.maxLife);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = a;
        ctx.fillRect(p.x, p.y, 3, 3);
        ctx.globalAlpha = 1;
    }
}
