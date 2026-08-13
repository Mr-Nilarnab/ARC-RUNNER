import type { Player } from "@/ts/core/types/entities.types";
import {
    GROUND_Y,
    PLAYER_INITIAL_X,
    PLAYER_STAND_WIDTH,
    PLAYER_STAND_HEIGHT,
    GRAVITY,
    JUMP_FORCE,
} from "@/ts/core/constants/game.constants";

export function createPlayer(): Player {
    return {
        x: PLAYER_INITIAL_X,
        y: GROUND_Y - PLAYER_STAND_HEIGHT,
        w: PLAYER_STAND_WIDTH,
        h: PLAYER_STAND_HEIGHT,
        vy: 0,
        jumping: false,
        ducking: false,
    };
}

export function updatePlayerPhysics(player: Player, k: number): void {
    if (player.jumping) {
        player.vy += GRAVITY * k;
        player.y += player.vy * k;
        const groundThreshold = GROUND_Y - PLAYER_STAND_HEIGHT;
        if (player.y >= groundThreshold || !Number.isFinite(player.y)) {
            player.y = groundThreshold;
            player.jumping = false;
            player.vy = 0;
        }
    }
}

export function triggerPlayerJump(player: Player): boolean {
    if (!player.jumping && !player.ducking) {
        player.jumping = true;
        player.vy = JUMP_FORCE;
        return true;
    }
    return false;
}

export function setPlayerDucking(player: Player, isDucking: boolean): boolean {
    const wasDucking = player.ducking;
    if (!player.jumping) {
        player.ducking = isDucking;
    }
    if (!isDucking) {
        player.ducking = false;
    }
    return !wasDucking && player.ducking && !player.jumping;
}
