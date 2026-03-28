import crypto from "node:crypto";
import { WebSocketServer, WebSocket } from "ws";
import { createGame, addPlayer } from "./game";
import { Question } from "./types";

type ExtendedWebSocket = WebSocket & {
  id: string;
};

const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;

const connections: ExtendedWebSocket[] = [];
const registeredClients: { name: string; password: string; wsId: string }[] =
  [];

const wss = new WebSocketServer({ port: PORT });

wss.on("connection", (ws: WebSocket) => {
  const extWs = ws as ExtendedWebSocket;

  const id = crypto.randomUUID();
  extWs.id = id;
  connections.push(extWs);

  console.log("Connection established");

  extWs.on("close", () => {
    const index = connections.findIndex((s) => s.id === id);
    connections.splice(index, 1);
  });

  extWs.on("message", (message) => {
    let { type, data } = JSON.parse(message.toString("utf8"));

    try {
      switch (type) {
        case "reg": {
          registeredClients.push({
            name: data.name,
            password: data.password,
            wsId: id,
          });
          extWs.send(
            JSON.stringify({
              type: type,
              data: {
                name: data.name,
                index: registeredClients.length - 1,
              },
              id: 0,
            }),
          );
          break;
        }
        case "create_game": {
          const game = createGame(data.questions as Question[], extWs.id);

          extWs.send(
            JSON.stringify({
              type: "game_created",
              data: {
                gameId: game.id,
                code: game.code,
              },
              id: 0,
            }),
          );
          break;
        }
        case "join_game": {
          const registeredClient = registeredClients.find(
            (c) => c.wsId === extWs.id,
          );

          if (!registeredClient) {
            throw new Error("Client is not registered");
          }
          const { name, gameId, gamePlayers } = addPlayer(
            data.code,
            registeredClient,
            extWs.id,
          );

          extWs.send(
            JSON.stringify({
              type: "game_joined",
              data: {
                gameId: gameId,
              },
              id: 0,
            }),
          );

          wss.clients.forEach(function each(client) {
            client.send(
              JSON.stringify({
                type: "player_joined",
                data: {
                  playerName: name,
                  playerCount: gamePlayers.length,
                },
                id: 0,
              }),
            );
          });

          wss.clients.forEach(function each(client) {
            client.send(
              JSON.stringify({
                type: "update_players",
                data: gamePlayers,
                id: 0,
              }),
            );
          });
          break;
        }
        default: {
          throw new Error("Unknown command");
        }
      }
    } catch (error: any) {
      extWs.send(
        JSON.stringify({
          type: "error",
          data: {
            messge: error.message,
          },
          id: 0,
        }),
      );
    }
  });
});
