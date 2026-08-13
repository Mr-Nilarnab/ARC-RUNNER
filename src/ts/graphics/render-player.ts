import type { Player } from "@/ts/core/types/entities.types";
import {
    GROUND_Y,
    PLAYER_DUCK_WIDTH,
    PLAYER_DUCK_HEIGHT,
} from "@/ts/core/constants/game.constants";
import { drawRoundRect } from "@/ts/graphics/render-utils";

export function drawPlayer(
    ctx: CanvasRenderingContext2D,
    player: Player,
    frame: number,
): void {
    const isDucking = player.ducking && !player.jumping;
    const x = player.x;
    const y = isDucking ? GROUND_Y - PLAYER_DUCK_HEIGHT : player.y;
    const w = isDucking ? PLAYER_DUCK_WIDTH : player.w;
    const h = isDucking ? PLAYER_DUCK_HEIGHT : player.h;

    ctx.save();
    ctx.shadowColor = "rgba(255,70,32,0.65)";
    ctx.shadowBlur = 14;

    const grad = ctx.createLinearGradient(x, y, x, y + h);
    grad.addColorStop(0, "#ff6a3d");
    grad.addColorStop(1, "#8c1f0f");
    ctx.fillStyle = grad;
    drawRoundRect(ctx, x, y, w, h, 6);
    ctx.fill();

    ctx.shadowBlur = 20;
    ctx.fillStyle = "#ffd9a8";
    ctx.beginPath();
    ctx.arc(x + w * 0.62, y + h * 0.4, isDucking ? 4 : 5, 0, Math.PI * 2);
    ctx.fill();

    ctx.shadowBlur = 0;
    ctx.strokeStyle = "rgba(20,10,6,0.6)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x + w * 0.15, y + h * 0.35);
    ctx.lineTo(x + w * 0.85, y + h * 0.35);
    ctx.stroke();

    if (!isDucking) {
        ctx.strokeStyle = "#3a1a10";
        ctx.lineWidth = 4;
        ctx.lineCap = "round";
        const legSwing = player.jumping ? 6 : Math.sin(frame * 0.5) * 8;
        ctx.beginPath();
        ctx.moveTo(x + 10, y + h);
        ctx.lineTo(x + 10 + legSwing, y + h + 10);
        ctx.moveTo(x + w - 10, y + h);
        ctx.lineTo(x + w - 10 - legSwing, y + h + 10);
        ctx.stroke();
    }
    ctx.restore();
}
