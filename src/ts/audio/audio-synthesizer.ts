import type { BeepOptions } from "@/ts/core/types/audio.types";
import type { AudioManager } from "@/ts/audio/audio-context";

export class AudioSynthesizer {
    private cachedNoiseBuffer: AudioBuffer | null = null;
    private cachedSampleRate = 0;

    public constructor(private readonly audioManager: AudioManager) {}

    public beep(opts: BeepOptions): void {
        if (this.audioManager.getMuted()) return;
        const ctx = this.audioManager.getContext();
        if (!ctx) return;

        const freq = opts.freq ?? 440;
        const duration = opts.duration ?? 0.1;
        const type = opts.type ?? "square";
        const vol = opts.vol ?? 0.12;
        const slideTo = opts.slideTo ?? null;
        const delay = opts.delay ?? 0;

        const t0 = ctx.currentTime + delay;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = type;
        osc.frequency.setValueAtTime(freq, t0);

        if (slideTo !== null) {
            osc.frequency.exponentialRampToValueAtTime(
                Math.max(1, slideTo),
                t0 + duration,
            );
        }

        gain.gain.setValueAtTime(vol, t0);
        gain.gain.exponentialRampToValueAtTime(0.0001, t0 + duration);

        osc.connect(gain).connect(ctx.destination);

        osc.onended = (): void => {
            osc.disconnect();
            gain.disconnect();
        };

        osc.start(t0);
        osc.stop(t0 + duration + 0.02);
    }

    public noiseBurst(duration: number, vol: number): void {
        if (this.audioManager.getMuted()) return;
        const ctx = this.audioManager.getContext();
        if (!ctx) return;

        const buffer = this.getOrCreateNoiseBuffer(ctx);
        const src = ctx.createBufferSource();
        src.buffer = buffer;

        const filter = ctx.createBiquadFilter();
        filter.type = "lowpass";
        filter.frequency.setValueAtTime(1800, ctx.currentTime);

        const gain = ctx.createGain();
        gain.gain.setValueAtTime(vol, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(
            0.0001,
            ctx.currentTime + duration,
        );

        src.connect(filter).connect(gain).connect(ctx.destination);

        src.onended = (): void => {
            src.disconnect();
            filter.disconnect();
            gain.disconnect();
        };

        src.start();
        src.stop(ctx.currentTime + duration);
    }

    private getOrCreateNoiseBuffer(ctx: AudioContext): AudioBuffer {
        if (
            this.cachedNoiseBuffer &&
            this.cachedSampleRate === ctx.sampleRate
        ) {
            return this.cachedNoiseBuffer;
        }

        const bufferSize = ctx.sampleRate; // 1.0 second cached noise
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);

        for (let i = 0; i < bufferSize; i++) {
            data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize);
        }

        this.cachedNoiseBuffer = buffer;
        this.cachedSampleRate = ctx.sampleRate;
        return buffer;
    }
}
