import gameState from "../states/gameState";
import { ExtendedWebSocket, Game, Player } from "../types";
import { broadcastAllGameParticipants } from "../utils/broadcastAllGameParticipants";
import { completeQuestion } from "./completeQuestion";

const disconnectAllActiveGamePlayers = (
  conn: ExtendedWebSocket,
  allConn: Set<ExtendedWebSocket>,
) => {
  const allGames = gameState.getAllActive();

  const newGames: Game[] = [];

  allGames.forEach((g) => {
    const players = g.players.filter((p) => p.index !== conn.id);
    if (players.length === g.players.length) {
      return;
    }

    const playerAnswers = new Map(g.playerAnswers);

    if (playerAnswers.has(conn.id)) {
      playerAnswers.delete(conn.id);
    }

    newGames.push({
      ...g,
      players,
      playerAnswers,
    });
  });

  const updatedGames = gameState.updateBatch(newGames);

  updatedGames.forEach((game) => {
    broadcastAllGameParticipants(game, allConn, (clConn) => {
      clConn.send(
        JSON.stringify({
          type: "update_players",
          data: game.players,
          id: 0,
        }),
      );
    });

    // If all other answered
    if (game.players.length === game.playerAnswers.size) {
      if (game.questionTimer) {
        clearTimeout(game.questionTimer);
      }

      if (game.players.length) {
        completeQuestion(game.id, allConn);
        return;
      }

      // No more players in the game
      gameState.update(game.id, {
        ...game,
        status: "finished",
      });

      const hostConn = Array.from(allConn).find(
        (clConn) => clConn.id === game.hostId,
      );

      hostConn?.send(
        JSON.stringify({
          type: "error",
          data: {
            message: "All players disconnected",
          },
          id: 0,
        }),
      );
    }
  });
};

const disconnectAllActiveGameHosts = (
  conn: ExtendedWebSocket,
  allConn: Set<ExtendedWebSocket>,
) => {
  const allGames = gameState.getAllActive();

  const newGames: Game[] = allGames
    .filter((g) => g.hostId === conn.id)
    .map((g) => ({
      ...g,
      status: "finished",
    }));

  const updatedGames = gameState.updateBatch(newGames);

  updatedGames.forEach((game) => {
    if (game.questionTimer) {
      clearTimeout(game.questionTimer);
    }

    allConn.forEach((clConn) => {
      if (game.players.some((p: Player) => p.index === clConn.id)) {
        clConn.send(
          JSON.stringify({
            type: "error",
            data: {
              message: "Host disconnected",
            },
            id: 0,
          }),
        );
      }
    });
  });
};

export const disconnectConnection = (
  conn: ExtendedWebSocket,
  allConn: Set<ExtendedWebSocket>,
) => {
  disconnectAllActiveGamePlayers(conn, allConn);
  disconnectAllActiveGameHosts(conn, allConn);
};
