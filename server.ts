import { WebSocketServer,WebSocket } from 'ws';
import { SERVER_PORT, WORLD_HEIGHT, WORLD_WIDTH } from './common.js';



type Player = {
    x: number,
    y: number,
};

const players= new Map<WebSocket,Player>();


const wws = new WebSocketServer({
    port:SERVER_PORT,
});

wws.on('connection', (ws) => {
    const player = {
        x: Math.random() * WORLD_WIDTH,
        y: Math.random() * WORLD_HEIGHT
    }

    //register the player
    players.set(ws, player);
    
    console.log(`Samebody connected!`)
})

console.log(`Listening to ws://localhost:${SERVER_PORT}`);