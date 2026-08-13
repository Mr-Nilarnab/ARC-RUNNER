import {
    BASE_DT,
    MAX_OBSTACLES,
    MAX_SCORE,
    MAX_SPEED,
    MILESTONE_INTERVAL,
    SCORE_FACTOR,
    SPEED_ACCELERATION,
} from "@/ts/core/constants";
import type { ISoundEffects } from "@/ts/core/types";
import {
    createObstacle,
    updateBackgroundDots,
    updateObstaclesInPlace,
    updateParticlesInPlace,
    updatePlayerPhysics,
} from "@/ts/entities";
import { checkCollision } from "@/ts/physics";
import type { GameStateModel } from "@/ts/game/game-state";

export interface GameSimulationCallbacks {
    readonly onGameOver: () => void;
}

export interface IGameSimulation {
    update(state: GameStateModel, dt: number): void;
}

export class GameSimulation implements IGameSimulation {
    private readonly sfx: ISoundEffects;
    private readonly callbacks: GameSimulationCallbacks;

    public constructor(
        sfx: ISoundEffects,
        callbacks: GameSimulationCallbacks,
    ) {
        this.sfx = sfx;
        this.callbacks = callbacks;
    }

    public update(state: GameStateModel, dt: number): void {
        const k = dt / BASE_DT;
        this.updateProgression(state, k);
        this.updateSpawner(state, dt);
        this.updateEntities(state, dt, k);
        this.checkCollisions(state);
    }

    private updateProgression(state: GameStateModel, k: number): void {
        state.frame++;
        state.score = Math.min(
            MAX_SCORE,
            state.score + k * (state.speed / 6) * SCORE_FACTOR,
        );
        state.speed = Math.min(
            MAX_SPEED,
            6 + state.score * SPEED_ACCELERATION,
        );

        const milestone = Math.floor(state.score / MILESTONE_INTERVAL);
        if (milestone > state.lastMilestone) {
            state.lastMilestone = milestone;
            this.sfx.playMilestone();
        }
    }

    private updateSpawner(state: GameStateModel, dt: number): void {
        state.spawnTimer += dt;
        if (state.spawnTimer > state.nextSpawn) {
            state.spawnTimer = 0;
            state.nextSpawn = Math.max(
                600,
                1250 - state.speed * 32 + Math.random() * 450,
            );
            // Enforce hard obstacle cap
            if (state.obstacles.length < MAX_OBSTACLES) {
                state.obstacles.push(createObstacle());
            }
        }
    }

    private updateEntities(state: GameStateModel, dt: number, k: number): void {
        updatePlayerPhysics(state.player, k);
        updateObstaclesInPlace(state.obstacles, state.speed, k);
        updateBackgroundDots(state.bgDots, state.speed, k);
        updateParticlesInPlace(state.particles, dt, k);
    }

    private checkCollisions(state: GameStateModel): void {
        for (const o of state.obstacles) {
            if (checkCollision(state.player, o)) {
                this.callbacks.onGameOver();
                break;
            }
        }
    }
}
