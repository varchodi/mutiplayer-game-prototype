import { WebSocketServer } from 'ws';
import { DEFAULT_MOVING, SERVER_PORT, WORLD_HEIGHT, WORLD_WIDTH } from './common.js';
const SERVER_FPS = 30;
const players = new Map();
let idCounter = 0;
const wws = new WebSocketServer({
    port: SERVER_PORT,
});
// ??
let eventQueue = [];
wws.on('connection', (ws) => {
    const id = idCounter++;
    const x = Math.random() * WORLD_WIDTH;
    const y = Math.random() * WORLD_HEIGHT;
    const player = {
        ws, id, x, y,
        moving: DEFAULT_MOVING,
    };
    //register the player
    players.set(id, player);
    console.log(`Player ${id} connected!`);
    // send respose to client;
    eventQueue.push({
        kind: 'PlayerJoined',
        id, x, y
    });
    // !! on message
    ws.on('message', () => {
    });
    // ! player disconnect
    ws.on("close", () => {
        console.log(`player ${id} disconnected`);
        players.delete(id);
        eventQueue.push({
            kind: 'PlayerLeft',
            id
        });
    });
});
//?? game kinda loop
function tick() {
    for (let event of eventQueue) {
        switch (event.kind) {
            case 'PlayerJoined':
                const joinedPlayer = players.get(event.id);
                if (joinedPlayer === undefined)
                    continue;
                joinedPlayer.ws.send(JSON.stringify({
                    kind: "Hello",
                    id: joinedPlayer.id,
                }));
                const eventString = JSON.stringify(event);
                // !! notify new player  when  joined _n change current state (add in game ??,plus_others)
                players.forEach((otherPlayer) => {
                    joinedPlayer.ws.send(JSON.stringify({
                        kind: 'PlayerJoined',
                        id: otherPlayer.id,
                        x: otherPlayer.x,
                        y: otherPlayer.y
                    }));
                    // !! notif other player states
                    if (otherPlayer.id !== joinedPlayer.id) {
                        otherPlayer.ws.send(eventString);
                    }
                });
                break;
            // player left
            case 'PlayerLeft':
                // ?? notif all players
                const eventStrings = JSON.stringify(event);
                players.forEach((player) => {
                    player.ws.send(eventStrings);
                });
                break;
        }
    }
    // ? clear up queue;
    eventQueue.length = 0;
    setTimeout(tick, 1000 / SERVER_FPS);
}
setTimeout(tick, 1000 / SERVER_FPS);
console.log(`Listening to ws://localhost:${SERVER_PORT}`);
//# sourceMappingURL=server.js.map