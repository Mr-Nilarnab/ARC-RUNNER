import type { ISoundEffects } from "@/ts/core/types/audio.types";
import type { AudioSynthesizer } from "@/ts/audio/audio-synthesizer";

export class SoundEffects implements ISoundEffects {
    public constructor(private readonly synth: AudioSynthesizer) {}

    public playBootBeep(): void {
        this.synth.beep({
            freq: 760 + Math.random() * 260,
            duration: 0.035,
            type: "square",
            vol: 0.06,
        });
    }

    public playClick(): void {
        this.synth.beep({
            freq: 640,
            duration: 0.05,
            type: "sine",
            vol: 0.08,
        });
    }

    public playJump(): void {
        this.synth.beep({
            freq: 480,
            slideTo: 900,
            duration: 0.12,
            type: "square",
            vol: 0.1,
        });
    }

    public playDuck(): void {
        this.synth.beep({
            freq: 320,
            slideTo: 140,
            duration: 0.09,
            type: "square",
            vol: 0.09,
        });
    }

    public playStart(): void {
        this.synth.beep({
            freq: 280,
            slideTo: 920,
            duration: 0.28,
            type: "sawtooth",
            vol: 0.09,
        });
    }

    public playMilestone(): void {
        this.synth.beep({
            freq: 660,
            duration: 0.08,
            type: "triangle",
            vol: 0.08,
        });
        this.synth.beep({
            freq: 880,
            duration: 0.14,
            type: "triangle",
            vol: 0.08,
            delay: 0.09,
        });
    }

    public playHit(): void {
        this.synth.noiseBurst(0.3, 0.16);
        this.synth.beep({
            freq: 420,
            slideTo: 50,
            duration: 0.45,
            type: "sawtooth",
            vol: 0.13,
        });
    }
}
