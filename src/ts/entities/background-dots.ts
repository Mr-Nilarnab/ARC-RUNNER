import type { BackgroundDot } from "@/ts/core/types/entities.types";
import {
    CANVAS_WIDTH,
    GROUND_Y,
    BG_DOTS_COUNT,
} from "@/ts/core/constants/game.constants";

export function createBackgroundDots(): BackgroundDot[] {
    const dots: BackgroundDot[] = [];
    for (let i = 0; i < BG_DOTS_COUNT; i++) {
        dots.push({
            x: Math.random() * CANVAS_WIDTH,
            y: 20 + Math.random() * (GROUND_Y - 40),
            s: Math.random() * 1.6 + 0.4,
        });
    }
    return dots;
}

export function updateBackgroundDots(
    dots: ReadonlyArray<BackgroundDot>,
    speed: number,
    k: number,
): void {
    for (const d of dots) {
        d.x -= speed * 0.3 * k;
        if (d.x < -4) {
            d.x = CANVAS_WIDTH + 4;
        }
    }
}
