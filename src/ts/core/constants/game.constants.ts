export const CANVAS_WIDTH = 900;
export const CANVAS_HEIGHT = 300;
export const GROUND_Y = CANVAS_HEIGHT - 38;

export const BOOT_DURATION_MS = 2600;
export const BOOT_LINES: ReadonlyArray<string> = [
    "INITIALIZING CORE...",
    "CALIBRATING EMBER REACTOR...",
    "LOADING TERRAIN GRID...",
    "ARMING SENSOR ARRAY...",
    "SYNCING HUD OVERLAY...",
    "SYSTEMS NOMINAL.",
];

export const INITIAL_SPEED = 6;
export const MAX_SPEED = 16;
export const SPEED_ACCELERATION = 0.0045;
export const SCORE_FACTOR = 0.9;
export const BASE_DT = 16.6667;

export const GRAVITY = 0.62;
export const JUMP_FORCE = -11.4;

export const PLAYER_INITIAL_X = 70;
export const PLAYER_STAND_WIDTH = 42;
export const PLAYER_STAND_HEIGHT = 50;
export const PLAYER_DUCK_WIDTH = 58;
export const PLAYER_DUCK_HEIGHT = 26;
export const PLAYER_DUCK_OFFSET_X = 8;

export const BG_DOTS_COUNT = 40;
export const MILESTONE_INTERVAL = 500;

export const MAX_OBSTACLES = 12;
export const MAX_PARTICLES = 120;
export const MAX_AUDIO_VOICES = 8;
export const MAX_BOOT_LOG_LINES = 10;
export const MAX_DT_MS = 50;
export const MAX_SCORE = 999999;
export const MAX_SPAWN_TIMER = 5000;
export const DPR_CAP = 3;
