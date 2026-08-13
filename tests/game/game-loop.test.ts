import { describe, expect, mock, test } from "bun:test";
import { GameLoop } from "@/ts/game/game-loop";

describe("GameLoop", () => {
    test("instantiates cleanly and supports timing reset", () => {
        const onUpdate = mock(() => {});
        const onRender = mock(() => {});
        const loop = new GameLoop({ onUpdate, onRender });

        expect(loop).toBeDefined();
        loop.resetTiming();
        loop.stop();
        loop.destroy();
    });
});
