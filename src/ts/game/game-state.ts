import type {
    BackgroundDot,
    GameState,
    Obstacle,
    Particle,
    Player,
} from "@/ts/core/types";
import { INITIAL_SPEED } from "@/ts/core/constants";
import { createBackgroundDots, createPlayer } from "@/ts/entities";

export class GameStateModel {
    public player: Player = createPlayer();
    public obstacles: Obstacle[] = [];
    public particles: Particle[] = [];
    public bgDots: BackgroundDot[] = createBackgroundDots();

    public score = 0;
    public best = 0;
    public speed = INITIAL_SPEED;
    public frame = 0;
    public lastMilestone = 0;
    public spawnTimer = 0;
    public nextSpawn = 1000;
    public gameState: GameState = "ready";

    public reset(): void {
        this.player = createPlayer();
        this.obstacles = [];
        this.particles = [];
        this.score = 0;
        this.speed = INITIAL_SPEED;
        this.spawnTimer = 0;
        this.nextSpawn = 1000;
        this.frame = 0;
        this.lastMilestone = 0;
    }
}
