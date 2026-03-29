import crypto from "node:crypto";
import { WebSocketServer, WebSocket } from "ws";
import { ExtendedWebSocket } from "./types";
import { handleClientRegistration } from "./actions/registerClients";
import { handleCreateGame } from "./actions/createGame";
import { handleJoinGame } from "./actions/joinGame";
import { handleSubmitAnswer } from "./actions/submitAnswer";
import { handleStartGame } from "./actions/startGame";
import { disconnectConnection } from "./actions/disconnectConnection";

const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;

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
      return handleStartGame;
    }
    case "answer": {
      return handleSubmitAnswer;
    }
  }
};

wss.on("connection", (ws: WebSocket) => {
  const extWs = ws as ExtendedWebSocket;

  const id = crypto.randomUUID();
  extWs.id = id;

  extWs.on("close", () => {
    disconnectConnection(extWs, wss.clients as Set<ExtendedWebSocket>);
  });

  ws.on("error", (error) => {
    console.error("Socket error:", error);
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
            message: error.message,
          },
          id: 0,
        }),
      );
    }
  });
});
