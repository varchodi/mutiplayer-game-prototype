import { Hello, isHello } from "./common.js";

(async () => {
    // from browser (the Websocket Interface, not same as the installed from nodejs)
    const ws = new WebSocket("ws://localhost:6970");

    // LISTENERS 
    ws.addEventListener("close", (event) => console.log("WEBSOCKET CLOSE", event));
    ws.addEventListener("error", (event) => {
        console.log(`WEBSOCKET ERROR, ${event}`)
    });
    ws.addEventListener("message", (event) => {
        const message = JSON.parse(event.data);
        if (isHello(message)) {
            message.id
        } else {
            console.log("received bogus-amogus message from server", message);
            ws.close();
        }
        console.log(`WEBSOCKET MESSAGE, ${message}`)
    });
    ws.addEventListener("open", (event) => console.log(`WEBSOCKET OPEN, ${event}`));
})();

console.log("hello bro cool"); 
