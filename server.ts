import { WebSocketServer, WebSocket } from "ws";
import {
  DEFAULT_MOVING,
  Event,
  isAmmaMoving,
  Player,
  SERVER_PORT,
  updatePlayer,
  WORLD_HEIGHT,
  WORLD_WIDTH,
} from "./common.js";

const SERVER_FPS = 30;

export interface PlayerWithSocket extends Player {
  ws: WebSocket;
}

const players = new Map<number, PlayerWithSocket>();
let idCounter = 0;

const wws = new WebSocketServer({
  port: SERVER_PORT,
});

// ??
let eventQueue: Array<Event> = [];

// generate style
function randomStyle(): string {
  return `hsl(${Math.floor(Math.random() * 360)} 80% 50%)`;
}

wws.on("connection", (ws: WebSocket) => {
  const id = idCounter++;
  const x = Math.random() * WORLD_WIDTH;
  const y = Math.random() * WORLD_HEIGHT;
  const style = randomStyle();
  const player: PlayerWithSocket = {
    ws,
    id,
    x,
    y,
    moving: {
      left: false,
      right: false,
      up: false,
      down: false,
    },
    style,
  };

  //register the player
  players.set(id, player);
  console.log(`Player ${id} connected!`);
  // send respose to client;
  eventQueue.push({
    kind: "PlayerJoined",
    id,
    x,
    y,
    style: style,
  });
  // !! on message
  ws.on("message", (data) => {
    const message = JSON.parse(data.toString());
    if (isAmmaMoving(message)) {
      console.log(`id:${id} -`, message);
      eventQueue.push({
        kind: "PlayerMoving",
        id,
        x: player.x,
        y: player.y,
        start: message.start,
        direction: message.direction,
      });
    } else {
      console.log(
        "received bogus-amogus message from client %s %S",
        id,
        message
      );
      ws.close();
    }
  });
  // ! player disconnect
  ws.on("close", () => {
    console.log(`player ${id} disconnected`);
    players.delete(id);
    eventQueue.push({
      kind: "PlayerLeft",
      id,
    });
  });
});

//?? game kinda loop
function tick() {
  for (let event of eventQueue) {
    switch (event.kind) {
      case "PlayerJoined":
        {
          const joinedPlayer = players.get(event.id);
          if (joinedPlayer === undefined) continue;

          joinedPlayer.ws.send(
            JSON.stringify({
              kind: "Hello",
              id: joinedPlayer.id,
            })
          );
          const eventString = JSON.stringify(event);
          // !! notify new player  when  joined _n change current state (add in game ??,plus_others)
          players.forEach((otherPlayer) => {
            joinedPlayer.ws.send(
              JSON.stringify({
                kind: "PlayerJoined",
                id: otherPlayer.id,
                x: otherPlayer.x,
                y: otherPlayer.y,
              })
            );

            // !! notif other player states
            if (otherPlayer.id !== joinedPlayer.id) {
              otherPlayer.ws.send(eventString);
            }
          });
        }
        break;

      // Player left
      case "PlayerLeft":
        {
          // ?? notif all players
          const eventString = JSON.stringify(event);
          players.forEach((player) => {
            player.ws.send(eventString);
          });
        }
        break;

      // Player Moving
      case "PlayerMoving":
        {
          const player = players.get(event.id);
          if (player === undefined) continue;
          player.moving[event.direction] = event.start;
          // notify others
          const eventString = JSON.stringify(event);
          players.forEach((player) => player.ws.send(eventString));
        }
        break;
    }
  }
  // ? clear up queue;
  eventQueue.length = 0;
  // ?? phys on players
  players.forEach((player) => updatePlayer(player, 1 / SERVER_FPS));

  setTimeout(tick, 1000 / SERVER_FPS);
}
setTimeout(tick, 1000 / SERVER_FPS);

console.log(`Listening to ws://localhost:${SERVER_PORT}`);
