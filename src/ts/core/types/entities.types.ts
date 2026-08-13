export interface Player {
    x: number;
    y: number;
    w: number;
    h: number;
    vy: number;
    jumping: boolean;
    ducking: boolean;
}

export type ObstacleType = "air" | "ground";

export interface Obstacle {
    readonly type: ObstacleType;
    x: number;
    readonly y: number;
    readonly w: number;
    readonly h: number;
}

export interface Particle {
    x: number;
    y: number;
    readonly vx: number;
    vy: number;
    life: number;
    readonly maxLife: number;
    readonly color: string;
}

export interface BackgroundDot {
    x: number;
    readonly y: number;
    readonly s: number;
}
