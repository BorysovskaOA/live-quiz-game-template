import gameState from "./gameState";
import { ExtendedWebSocket, Player } from "./types";
import { createScoreboard } from "./utils/createScoreboard";

export const finishGame = (gameId: string, allConn: Set<ExtendedWebSocket>) => {
  const game = gameState.getById(gameId);
  const scoreboard = createScoreboard(game);

  gameState.update(game.id, { ...game, status: "finished" });

  allConn.forEach((clConn) => {
    if (game.players.some((p: Player) => p.index === clConn.id)) {
      clConn.send(
        JSON.stringify({
          type: "game_finished",
          data: {
            scoreboard,
          },
          id: 0,
        }),
      );
    }
  });
};
