import type { Obstacle } from "@/ts/core/types/entities.types";
import { CANVAS_WIDTH, GROUND_Y } from "@/ts/core/constants/game.constants";

export function createObstacle(): Obstacle {
    const isAir = Math.random() < 0.32;
    if (isAir) {
        return {
            type: "air",
            x: CANVAS_WIDTH + 20,
            y: GROUND_Y - 67,
            w: 34,
            h: 22,
        };
    }

    const h = 30 + Math.random() * 22;
    const w = 18 + Math.random() * 16;
    return {
        type: "ground",
        x: CANVAS_WIDTH + 20,
        y: GROUND_Y - h,
        w,
        h,
    };
}

export function updateObstaclesInPlace(
    obstacles: Obstacle[],
    speed: number,
    k: number,
): void {
    let activeCount = 0;
    for (let i = 0; i < obstacles.length; i++) {
        const o = obstacles[i];
        if (!o) continue;
        o.x -= speed * k;
        if (o.x + o.w > -20) {
            obstacles[activeCount++] = o;
        }
    }
    obstacles.length = activeCount;
}

export function updateObstacles(
    obstacles: ReadonlyArray<Obstacle>,
    speed: number,
    k: number,
): Obstacle[] {
    const nextList: Obstacle[] = [];
    for (const o of obstacles) {
        o.x -= speed * k;
        if (o.x + o.w > -20) {
            nextList.push(o);
        }
    }
    return nextList;
}
