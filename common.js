export const SERVER_PORT = 6970;
export const WORLD_WIDTH = 800;
export const WORLD_HEIGHT = 600;
// type guard checker fxs
export function isHello(arg) {
    return arg && arg.kind === 'Hello' && typeof (arg.id) === 'number';
}
//# sourceMappingURL=common.js.map