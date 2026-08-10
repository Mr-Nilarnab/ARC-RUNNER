export type WaveformType = "sine" | "square" | "sawtooth" | "triangle";

export interface BeepOptions {
    readonly freq?: number;
    readonly duration?: number;
    readonly type?: WaveformType;
    readonly vol?: number;
    readonly slideTo?: number | null;
    readonly delay?: number;
}

export interface ISoundEffects {
    playBootBeep(): void;
    playClick(): void;
    playJump(): void;
    playDuck(): void;
    playStart(): void;
    playMilestone(): void;
    playHit(): void;
}
