import {
  DEFAULT_MOVING,
  isHello,
  isPlayerJoined,
  isPlayerLeft,
  PLAYER_SIZE,
  WORLD_HEIGHT,
  WORLD_WIDTH,
  Direction,
  isPlayerMoving,
  updatePlayer,
} from "./common.js";
import { Player } from "./common.js";

const DIRECTION_KEYS: { [key: string]: Direction } = {
  ArrowLeft: "left",
  ArrowRight: "right",
  ArrowUp: "up",
  ArrowDown: "down",
  KeyA: "left",
  KeyD: "right",
  KeyS: "down",
  KeyW: "up",
};

(async () => {
  const gamecanvas = document.getElementById("game") as HTMLCanvasElement;
  if (gamecanvas === null) throw new Error(`No Element with id 'game'`);
  gamecanvas.width = WORLD_WIDTH;
  gamecanvas.height = WORLD_HEIGHT;

  const ctx = gamecanvas.getContext("2d")!;
  if (ctx === null) throw new Error("2d canvas is not supported");

  // from browser (the Websocket Interface, not same as the installed from nodejs)
  const ws = new WebSocket("ws://localhost:3001");

  let myId: undefined | number = undefined;
  const players = new Map<number, Player>();

  // LISTENERS
  ws.addEventListener("close", (event) =>
    console.log("WEBSOCKET CLOSE", event)
  );
  ws.addEventListener("error", (event) => {
    console.log("WEBSOCKET ERROR,", event);
  });
  ws.addEventListener("message", (event) => {
    if (myId === undefined) {
      const message = JSON.parse(event.data);
      if (isHello(message)) {
        myId = message.id;
        console.log("Connected as player,", myId);
      } else {
        console.log("received bogus-amogus message from server", message);
        ws.close();
      }
    }
    // already being created (or joined)
    else {
      const message = JSON.parse(event.data);
      if (isPlayerJoined(message)) {
        players.set(message.id, {
          id: message.id,
          x: message.x,
          y: message.y,
          moving: {
            left: false,
            right: false,
            up: false,
            down: false,
          },
          style: message.style,
        });
      }
      //  ?? if player left
      else if (isPlayerLeft(message)) {
        players.delete(message.id);
      }
      //   player Moving
      else if (isPlayerMoving(message)) {
        const player = players.get(message.id);
        if (player === undefined) {
          console.log(
            `Received bogus-amogus message from server. We don't know anything about player with id ${message.id}`,
            message
          );
          ws.close();
          return;
        }
        player.moving[message.direction] = message.start;
        player.x = message.x;
        player.y = message.y;
      } else {
        console.log("received bogus-amogus message from server", message);
        ws.close();
      }
    }
  });
  ws.addEventListener("open", (event) => console.log("WEBSOCKET OPEN,", event));

  let previousTimestamp = 0;
  const frame = (timestamp: number) => {
    const deltaTime = (timestamp - previousTimestamp) / 1000;
    previousTimestamp = timestamp;

    // style canvas color
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    // draw players
    players.forEach((player) => {
      ctx.fillStyle = player.style;
      updatePlayer(player, deltaTime);
      ctx.fillRect(player.x, player.y, PLAYER_SIZE, PLAYER_SIZE);
    });

    window.requestAnimationFrame(frame);
  };
  window.requestAnimationFrame((timestamp) => {
    previousTimestamp = timestamp;
    window.requestAnimationFrame(frame);
  });

  window.addEventListener("keydown", (e) => {
    // if (ws !== undefined && me !== undefined) {
    if (!e.repeat) {
      const direction = DIRECTION_KEYS[e.code];
      if (direction !== undefined) {
        ws.send(
          JSON.stringify({
            kind: "AmmaMoving",
            start: true,
            direction,
          })
        );
      }
    }
    // }
  });
  window.addEventListener("keyup", (e) => {
    if (!e.repeat) {
      const direction = DIRECTION_KEYS[e.code];
      if (direction !== undefined) {
        ws.send(
          JSON.stringify({
            kind: "AmmaMoving",
            start: false,
            direction,
          })
        );
      }
    }
  });
})();

console.log("hello bro cool");
