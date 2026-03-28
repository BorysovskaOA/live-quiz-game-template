import crypto from "node:crypto";
import { WebSocketServer, WebSocket } from "ws";
import { ExtendedWebSocket } from "./types";
import { handleClientRegistration } from "./registerClients";
import { handleCreateGame } from "./createGame";
import { handleJoinGame } from "./joinGame";
import { handleSubmitAnswer } from "./submitAnswer";

const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;

const connections: ExtendedWebSocket[] = [];

const wss = new WebSocketServer({ port: PORT });

const getHandlerFn = (type: string) => {
  switch (type) {
    case "reg": {
      return handleClientRegistration;
    }
    case "create_game": {
      return handleCreateGame;
    }
    case "join_game": {
      return handleJoinGame;
    }
    case "start_game": {
      return handleCreateGame;
    }
    case "submit_answer": {
      return handleSubmitAnswer;
    }
  }
};

wss.on("connection", (ws: WebSocket) => {
  const extWs = ws as ExtendedWebSocket;

  const id = crypto.randomUUID();
  extWs.id = id;
  connections.push(extWs);

  extWs.on("close", () => {
    const index = connections.findIndex((s) => s.id === id);
    connections.splice(index, 1);
  });

  extWs.on("message", (message) => {
    let { type, data } = JSON.parse(message.toString("utf8"));

    try {
      const handler = getHandlerFn(type);

      if (!handler) {
        throw new Error("Unknown command");
      }

      handler(data, extWs, wss.clients as Set<ExtendedWebSocket>);
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
