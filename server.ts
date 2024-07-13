import { WebSocketServer } from 'ws';

const SERVER_PORT = 6970;


const wws = new WebSocketServer({
    port:SERVER_PORT,
});

wws.on('connection', (ws) => {
    console.log(`Samebody connected!`)
})

console.log(`Listening to ws://localhost:${SERVER_PORT}`);