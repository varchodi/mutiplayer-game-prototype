export const SERVER_PORT = 6970;
export const WORLD_WIDTH = 800;
export const WORLD_HEIGHT = 600;
export const PLAYER_SIZE = 30;
export const DEFAULT_MOVING = {
    left: false,
    right: false,
    down: false,
    up: false,
};
export const DIRECTION_VECTOR = {
    left: { x: -1, y: 0 },
    right: { x: 1, y: 0 },
    down: { x: 0, y: -1 },
    up: { x: 0, y: 1 },
};
// type checker helper functions
function isNumber(arg) {
    return typeof (arg) === 'number';
}
function isBoolean(arg) {
    return typeof (arg) === 'boolean';
}
function isDirection(arg) {
    // check if all keys r avalaible
    return DEFAULT_MOVING[arg] !== undefined;
}
// Hello type guard checker fxs 
export function isHello(arg) {
    return arg && arg.kind === 'Hello' && isNumber(arg.id);
}
// PlayerJoinded  type guard checker fxs
export function isPlayerJoined(arg) {
    return arg && arg.kind === 'PlayerJoined' && isNumber(arg.id) && isNumber(arg.x) && isNumber(arg.y);
}
// PlayerJoinded  type guard checker fxs
export function isPlayerLeft(arg) {
    return arg && arg.kind === 'PlayerLeft' && isNumber(arg.id);
}
// PlayerMoving  type guard checker fxs
export function isPlayerMoving(arg) {
    return arg && arg.kind === 'PlayerMoving' && isNumber(arg.id) && isBoolean(arg.start) && isDirection(arg.direction);
}
// ?? will  be used in bith client _n server
export function updatePlayer(player, deltaTime) {
    let dir;
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
//# sourceMappingURL=common.js.map