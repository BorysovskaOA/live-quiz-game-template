import { JoinGameData, ExtendedWebSocket, Player } from "../types";
import registeredClientsState from "../states/registeredClientsState.js";
import gameState from "../states/gameState";
import { broadcastAllGameParticipants } from "../utils/broadcastAllGameParticipants";

export const handleJoinGame = (
  { code }: JoinGameData,
  conn: ExtendedWebSocket,
  allConn: Set<ExtendedWebSocket>,
) => {
  const registeredClient = registeredClientsState.getByConnectionId(conn.id);
  const game = gameState.getByCode(code);

  if (game.status !== "waiting") {
    throw new Error("Invalid input");
  }

  const player: Player = {
    name: registeredClient.name,
    index: conn.id,
    score: 0,
  };

  const updatedGame = gameState.update(game.id, {
    ...game,
    players: [...game.players, player],
  });

  conn.send(
    JSON.stringify({
      type: "game_joined",
      data: {
        gameId: game.id,
      },
      id: 0,
    }),
  );

  broadcastAllGameParticipants(
    updatedGame,
    allConn,
    (clConn: ExtendedWebSocket) => {
      clConn.send(
        JSON.stringify({
          type: "player_joined",
          data: {
            playerName: player.name,
            playerCount: updatedGame.players.length,
          },
          id: 0,
        }),
      );

      clConn.send(
        JSON.stringify({
          type: "update_players",
          data: updatedGame.players,
          id: 0,
        }),
      );
    },
  );
};
