import {
    drawBackground,
    drawObstacle,
    drawParticles,
    drawPlayer,
} from "@/ts/graphics";
import type { DomElements, HudManager } from "@/ts/ui";
import type { GameStateModel } from "@/ts/game/game-state";

export interface IGameRenderer {
    render(state: GameStateModel): void;
}

export interface GameRendererOptions {
    readonly dom: DomElements;
    readonly hudManager: HudManager;
}

export class GameRenderer implements IGameRenderer {
    private readonly dom: DomElements;
    private readonly hudManager: HudManager;

    public constructor(options: GameRendererOptions) {
        this.dom = options.dom;
        this.hudManager = options.hudManager;
    }

    public render(state: GameStateModel): void {
        const { ctx } = this.dom;
        drawBackground(ctx, state.bgDots, state.frame, state.speed);
        for (const obstacle of state.obstacles) {
            drawObstacle(ctx, obstacle, state.frame);
        }
        drawParticles(ctx, state.particles);
        drawPlayer(ctx, state.player, state.frame);
        this.hudManager.updateStats(state.score, state.best, state.speed);
    }
}
