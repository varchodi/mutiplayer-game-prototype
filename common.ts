export const SERVER_PORT = 6970;
export const WORLD_WIDTH = 800;
export const WORLD_HEIGHT = 600;
export const PLAYER_SIZE = 30;

type Direction = 'left' | 'right' | 'up' | 'down';

type Moving={
    [key in Direction]: boolean;
};

export const DEFAULT_MOVING: Moving = {
    left: false,
    right: false,
    down: false,
    up: false,
};

export type Vector2 = { x: number, y: number };

export const DIRECTION_VECTOR: { [key in Direction]: Vector2 } = {
    left: {x:-1,y:0},
    right: {x:1,y:0},
    down: { x: 0, y: -1},
    up: {x:0,y:1},
};

export type Player = {
    id:number,
    x: number,
    y: number,
    moving: Moving;
};

// type checker helper functions
function isNumber(arg: any): arg is number{
    return typeof (arg) === 'number';
}

function isBoolean(arg: any): arg is boolean{
    return typeof (arg) === 'boolean';
}

function isDirection(arg: any): arg is Direction{
    // check if all keys r avalaible
    return DEFAULT_MOVING[arg as Direction] !==undefined;
}
export interface Hello{
    kind: "Hello",
    id:number,
}

// Hello type guard checker fxs 
export function isHello(arg: any): arg is Hello {
    return arg && arg.kind === 'Hello' && isNumber(arg.id);
}

export interface PlayerJoined {
    kind: "PlayerJoined",
    id: number,
    x: number,
    y:number
}
// PlayerJoinded  type guard checker fxs
export function isPlayerJoined(arg: any): arg is Player {
    return arg && arg.kind === 'PlayerJoined' && isNumber(arg.id) && isNumber(arg.x) && isNumber(arg.y);
}

// player left(or disconnect)
export interface PlayerLeft {
    kind: "PlayerLeft",
    id: number,
}
// PlayerJoinded  type guard checker fxs
export function isPlayerLeft(arg: any): arg is Player {
    return arg && arg.kind === 'PlayerLeft' && isNumber(arg.id);
}

//  Player Moving
export interface PlayerMoving{
    kind: 'PlayerMoving',
    id: number,
    start: boolean,
    direction:Direction,
}
// PlayerMoving  type guard checker fxs
export function isPlayerMoving(arg: any): arg is PlayerMoving {
    return arg && arg.kind === 'PlayerMoving' && isNumber(arg.id) && isBoolean(arg.start) && isDirection(arg.direction);
}

export type Event = PlayerJoined | PlayerLeft | PlayerMoving;

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
    player.x = dx * deltaTime;
    player.y = dy * deltaTime;
}
