import type { BackgroundDot } from "@/ts/core/types/entities.types";
import {
    CANVAS_WIDTH,
    CANVAS_HEIGHT,
    GROUND_Y,
} from "@/ts/core/constants/game.constants";

export function drawBackground(
    ctx: CanvasRenderingContext2D,
    bgDots: ReadonlyArray<BackgroundDot>,
    frame: number,
    speed: number,
): void {
    ctx.fillStyle = "#0b0907";
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    ctx.fillStyle = "rgba(255,135,82,0.35)";
    for (const d of bgDots) {
        ctx.fillRect(d.x, d.y, d.s, d.s);
    }

    ctx.save();
    ctx.shadowColor = "rgba(255,70,32,0.55)";
    ctx.shadowBlur = 10;
    ctx.strokeStyle = "#ff4620";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(0, GROUND_Y + 1);
    ctx.lineTo(CANVAS_WIDTH, GROUND_Y + 1);
    ctx.stroke();
    ctx.restore();

    ctx.strokeStyle = "rgba(74,63,54,0.4)";
    ctx.lineWidth = 1;
    const gridOffset = (frame * 1.2 * (speed / 6)) % 40;
    ctx.beginPath();
    for (let x = -gridOffset; x < CANVAS_WIDTH; x += 40) {
        ctx.moveTo(x, GROUND_Y + 1);
        ctx.lineTo(x - 14, CANVAS_HEIGHT);
    }
    ctx.stroke();
}
