import { isHello, isPlayerJoined } from "./common.js";
(async () => {
    // from browser (the Websocket Interface, not same as the installed from nodejs)
    const ws = new WebSocket("ws://localhost:6970");
    let myId = undefined;
    const players = new Map();
    // LISTENERS 
    ws.addEventListener("close", (event) => console.log("WEBSOCKET CLOSE", event));
    ws.addEventListener("error", (event) => {
        console.log("WEBSOCKET ERROR,", event);
    });
    ws.addEventListener("message", (event) => {
        if (myId === undefined) {
            const message = JSON.parse(event.data);
            if (isHello(message)) {
                myId = message.id;
                console.log("Connected as player,", myId);
            }
            else {
                console.log("received bogus-amogus message from server", message);
                ws.close();
            }
        }
        // already being created (or joined)
        else {
            const message = JSON.parse(event.data);
            if (isPlayerJoined(message)) {
            }
            else {
                console.log("received bogus-amogus message from server", message);
                ws.close();
            }
        }
    });
    ws.addEventListener("open", (event) => console.log("WEBSOCKET OPEN,", event));
})();
console.log("hello bro cool");
//# sourceMappingURL=client.js.map