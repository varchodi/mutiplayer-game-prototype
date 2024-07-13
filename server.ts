import { WebSocketServer,WebSocket } from 'ws';
import { SERVER_PORT, WORLD_HEIGHT, WORLD_WIDTH } from './common.js';



type Player = {
    id:number,
    x: number,
    y: number,
};

const players = new Map<WebSocket, Player>();
let idCounter = 0;


const wws = new WebSocketServer({
    port:SERVER_PORT,
});

wws.on('connection', (ws:WebSocket) => {
    const id = idCounter ++;
    const player = {
        id,
        x: Math.random() * WORLD_WIDTH,
        y: Math.random() * WORLD_HEIGHT
    }

    //register the player
    players.set(ws, player);
    console.log(`Player ${id} connected!`);
    // send respose to client;
    ws.send(JSON.stringify({
        kind: "Hello",
        id,
    }))

    ws.on("close",() => {
        console.log(`player ${id} disconnected`);
        players.delete(ws);
    })

})

console.log(`Listening to ws://localhost:${SERVER_PORT}`);