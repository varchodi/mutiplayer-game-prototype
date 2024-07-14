export const SERVER_PORT = 6970;
export const WORLD_WIDTH = 800;
export const WORLD_HEIGHT = 600;
export const PLAYER_SIZE = 30;
// checker helper functions
export function isNumber(arg) {
    return typeof (arg) === 'number';
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
//# sourceMappingURL=common.js.map