import type { Player, Obstacle } from "@/ts/core/types/entities.types";
import {
    GROUND_Y,
    PLAYER_DUCK_WIDTH,
    PLAYER_DUCK_HEIGHT,
    PLAYER_DUCK_OFFSET_X,
} from "@/ts/core/constants/game.constants";

export function checkCollision(p: Player, o: Obstacle): boolean {
    const pw = p.ducking ? PLAYER_DUCK_WIDTH : p.w;
    const ph = p.ducking ? PLAYER_DUCK_HEIGHT : p.h;
    const py = p.ducking ? GROUND_Y - PLAYER_DUCK_HEIGHT : p.y;
    const px = p.x - (p.ducking ? PLAYER_DUCK_OFFSET_X : 0);

    return px < o.x + o.w && px + pw > o.x && py < o.y + o.h && py + ph > o.y;
}
