export interface RandomSource {
    next(): number; // returns [0, 1)
    nextRange(min: number, max: number): number;
    nextInt(min: number, max: number): number;
}

export function createSeededRandom(seed: number): RandomSource {
    let state = seed | 0;
    function next(): number {
        state = (state + 0x6d2b79f5) | 0;
        let t = Math.imul(state ^ (state >>> 15), 1 | state);
        t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    }
    return {
        next,
        nextRange(min: number, max: number): number {
            return min + next() * (max - min);
        },
        nextInt(min: number, max: number): number {
            return Math.floor(min + next() * (max - min));
        },
    };
}

export function createMathRandom(): RandomSource {
    return {
        next(): number {
            return Math.random();
        },
        nextRange(min: number, max: number): number {
            return min + Math.random() * (max - min);
        },
        nextInt(min: number, max: number): number {
            return Math.floor(min + Math.random() * (max - min));
        },
    };
}
