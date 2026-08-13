export function clamp(value: number, min: number, max: number): number {
    if (!Number.isFinite(value)) return min;
    return value < min ? min : value > max ? max : value;
}

export function safeFinite(value: number, fallback: number): number {
    return Number.isFinite(value) ? value : fallback;
}
