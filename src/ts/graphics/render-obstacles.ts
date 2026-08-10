import type { Obstacle } from "@/ts/core/types/entities.types";

export function drawObstacle(
    ctx: CanvasRenderingContext2D,
    o: Obstacle,
    frame: number,
): void {
    ctx.save();
    if (o.type === "ground") {
        ctx.shadowColor = "rgba(122,36,16,0.7)";
        ctx.shadowBlur = 8;
        ctx.fillStyle = "#2a120a";
        ctx.fillRect(o.x, o.y, o.w, o.h);
        ctx.strokeStyle = "#7a2410";
        ctx.lineWidth = 1.5;
        ctx.strokeRect(o.x, o.y, o.w, o.h);
        ctx.fillStyle = "#ffb545";
        const slots = Math.max(2, Math.floor(o.h / 12));
        for (let i = 0; i < slots; i++) {
            ctx.fillRect(o.x + 3, o.y + 5 + i * 11, o.w - 6, 3);
        }
    } else {
        ctx.shadowColor = "rgba(255,70,32,0.6)";
        ctx.shadowBlur = 10;
        ctx.fillStyle = "#ff4620";
        const cx = o.x + o.w / 2;
        const cy = o.y + o.h / 2;
        ctx.beginPath();
        ctx.moveTo(cx, o.y);
        ctx.lineTo(o.x + o.w, cy);
        ctx.lineTo(cx, o.y + o.h);
        ctx.lineTo(o.x, cy);
        ctx.closePath();
        ctx.fill();

        const flap = Math.sin(frame * 0.4) * 6;
        ctx.strokeStyle = "#ffb545";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(cx - 14, cy - flap);
        ctx.moveTo(cx, cy);
        ctx.lineTo(cx + 14, cy + flap);
        ctx.stroke();
    }
    ctx.restore();
}
