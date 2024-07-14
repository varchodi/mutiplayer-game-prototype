import { WebSocketServer } from 'ws';
import { SERVER_PORT, WORLD_HEIGHT, WORLD_WIDTH } from './common.js';
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
    const player = { ws, id, x, y };
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
    });
});
//?? game kinda loop
function tick() {
    for (let event of eventQueue) {
        switch (event.kind) {
            case 'PlayerJoined':
                const player = players.get(event.id);
                if (player === undefined)
                    continue;
                player.ws.send(JSON.stringify({
                    kind: "Hello",
                    id: player.id,
                }));
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