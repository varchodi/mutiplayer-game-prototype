export const SERVER_PORT = 3001;
export const WORLD_WIDTH = 800;
export const WORLD_HEIGHT = 600;
export const PLAYER_SIZE = 30;
export const PLAYER_SPEED = 500;

export type Direction = "left" | "right" | "up" | "down";

type Moving = {
  [key in Direction]: boolean;
};

export const DEFAULT_MOVING: Moving = {
  left: false,
  right: false,
  down: false,
  up: false,
};

export type Vector2 = { x: number; y: number };

export const DIRECTION_VECTOR: { [key in Direction]: Vector2 } = {
  left: { x: -1, y: 0 },
  right: { x: 1, y: 0 },
  up: { x: 0, y: -1 },
  down: { x: 0, y: 1 },
};

export type Player = {
  id: number;
  x: number;
  y: number;
  moving: Moving;
  style: string;
};

// type checker helper functions
function isNumber(arg: any): arg is number {
  return typeof arg === "number";
}

function isBoolean(arg: any): arg is boolean {
  return typeof arg === "boolean";
}

function isString(arg: any): arg is string {
  return typeof arg === "string";
}

function isDirection(arg: any): arg is Direction {
  // check if all keys r avalaible
  return DIRECTION_VECTOR[arg as Direction] !== undefined;
}
export interface Hello {
  kind: "Hello";
  id: number;
}

// Hello type guard checker fxs
export function isHello(arg: any): arg is Hello {
  return arg && arg.kind === "Hello" && isNumber(arg.id);
}

export interface PlayerJoined {
  kind: "PlayerJoined";
  id: number;
  x: number;
  y: number;
  style: string;
}
// PlayerJoinded  type guard checker fxs
export function isPlayerJoined(arg: any): arg is Player {
  return (
    arg &&
    arg.kind === "PlayerJoined" &&
    isNumber(arg.id) &&
    isNumber(arg.x) &&
    isNumber(arg.y) &&
    arg.style
  );
}

// player left(or disconnect)
export interface PlayerLeft {
  kind: "PlayerLeft";
  id: number;
}
// PlayerJoinded  type guard checker fxs
export function isPlayerLeft(arg: any): arg is Player {
  return arg && arg.kind === "PlayerLeft" && isNumber(arg.id);
}
// Player Moving (client -> server)
export interface AmmaMoving {
  kind: "AmmaMoving";
  start: boolean;
  direction: Direction;
}

//  Player Moving (server -> rest_of_clients)
export interface PlayerMoving {
  kind: "PlayerMoving";
  id: number;
  x: number;
  y: number;
  start: boolean;
  direction: Direction;
}

// PlayerMoving  type guard checker fxs
export function isPlayerMoving(arg: any): arg is PlayerMoving {
  return (
    arg &&
    arg.kind === "PlayerMoving" &&
    isNumber(arg.id) &&
    isNumber(arg.x) &&
    isNumber(arg.y) &&
    isBoolean(arg.start) &&
    isDirection(arg.direction)
  );
}

// AmmaMoving  type guard checker fxs
export function isAmmaMoving(arg: any): arg is AmmaMoving {
  return (
    arg &&
    arg.kind === "AmmaMoving" &&
    isBoolean(arg.start) &&
    isDirection(arg.direction)
  );
}

export type Event = PlayerJoined | PlayerLeft | PlayerMoving | AmmaMoving;

// ?? will  be used in bith client _n server
export function updatePlayer(player: Player, deltaTime: number) {
  let dir: Direction;
  let dx = 0;
  let dy = 0;
  for (dir in DIRECTION_VECTOR) {
    // if moving in dir
    if (player.moving[dir]) {
      dx += DIRECTION_VECTOR[dir].x;
      dy += DIRECTION_VECTOR[dir].y;
    }
  }
  player.x += dx * PLAYER_SPEED * deltaTime;
  player.y += dy * PLAYER_SPEED * deltaTime;
  //   console.log(`player ${player.id}: ${player.x},${player.y}`);
}
