import gameState from "../states/gameState";
import { ExtendedWebSocket, Player } from "../types";
import { broadcastAllGameParticipants } from "../utils/broadcastAllGameParticipants";
import { createScoreboard } from "../utils/createScoreboard";

export const finishGame = (gameId: string, allConn: Set<ExtendedWebSocket>) => {
  const game = gameState.getById(gameId);
  const scoreboard = createScoreboard(game);

  const updatedGame = gameState.update(game.id, {
    ...game,
    status: "finished",
  });

  broadcastAllGameParticipants(
    updatedGame,
    allConn,
    (clConn: ExtendedWebSocket) => {
      clConn.send(
        JSON.stringify({
          type: "game_finished",
          data: {
            scoreboard,
          },
          id: 0,
        }),
      );
    },
  );
};
