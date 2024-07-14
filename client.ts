import { Hello, isHello, isPlayerJoined, isPlayerLeft, PLAYER_SIZE, WORLD_HEIGHT, WORLD_WIDTH } from "./common.js";
import { Player } from "./common.js";

(async () => {
    const gamecanvas = document.getElementById("game") as HTMLCanvasElement;
    if (gamecanvas === null) throw new Error(`No Element with id 'game'`);
    gamecanvas.width = WORLD_WIDTH;
    gamecanvas.height = WORLD_HEIGHT;

    const ctx = gamecanvas.getContext('2d')!;
    if (ctx === null) throw new Error('2d canvas is not supported');

    ctx

    // from browser (the Websocket Interface, not same as the installed from nodejs)
    const ws = new WebSocket("ws://localhost:6970");

    let myId: undefined | number = undefined;
    const players = new Map<number, Player>();

    // LISTENERS 
    ws.addEventListener("close", (event) => console.log("WEBSOCKET CLOSE", event));
    ws.addEventListener("error", (event) => {
        console.log("WEBSOCKET ERROR,", event)
    });
    ws.addEventListener("message", (event) => {
        if(myId === undefined){ 
        const message = JSON.parse(event.data);
            if (isHello(message)) {
                myId = message.id;
                console.log("Connected as player,",myId);
        } else {
            console.log("received bogus-amogus message from server", message);
            ws.close();
            }
        }
        // already being created (or joined)
        else {
            const message = JSON.parse(event.data) ;
            if (isPlayerJoined(message)) {
                players.set(message.id, {
                    id: message.id,
                    x: message.x,
                    y: message.y,
                    moving: {
                        left: false,
                        right:false,
                        down: false,
                        up:false,
                    }
                })
            }
            //  ?? if player left
            else if (isPlayerLeft(message)) {
                players.delete(message.id);
            }
            else {
                console.log("received bogus-amogus message from server", message);
                ws.close();
            }
        }
    });
    ws.addEventListener("open", (event) => console.log("WEBSOCKET OPEN,", event));

    let previousTimestamp = 0;
    const frame = (timestamp:number) => {
        const deltaTime = (timestamp - previousTimestamp) / 1000;
        previousTimestamp = timestamp;

        // style canvas color
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        // draw players
        ctx.fillStyle = 'red';
        players.forEach((player) => {
            ctx.fillRect(player.x, player.y, PLAYER_SIZE, PLAYER_SIZE);
        })

        window.requestAnimationFrame(frame);
    }
    window.requestAnimationFrame((timestamp) => {
        previousTimestamp = timestamp;
        window.requestAnimationFrame(frame);
    });
})();

console.log("hello bro cool"); 
