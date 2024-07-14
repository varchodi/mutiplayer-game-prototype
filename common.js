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
//# sourceMappingURL=common.js.map