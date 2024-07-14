export const SERVER_PORT = 6970;
export const WORLD_WIDTH = 800;
export const WORLD_HEIGHT = 600;
export const PLAYER_SIZE = 30;

type Direction = 'left' | 'right' | 'up' | 'down';

export type Player = {
    id:number,
    x: number,
    y: number,
    moving: {
        [key in Direction]: boolean;
    },
};

// checker helper functions
export function isNumber(arg: any): arg is number{
    return typeof (arg) === 'number';
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

export type Event = PlayerJoined | PlayerLeft;
