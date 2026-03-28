import gameState from "./gameState";
import { ExtendedWebSocket, Game, Player } from "./types";
import { createTimerFn } from "./utils/createTimerFn";
import { formatQuestion } from "./utils/formatQuestion";

export const nextQuestion = (
  gameId: string,
  allConn: Set<ExtendedWebSocket>,
) => {
  const game = gameState.getById(gameId);

  const newGame: Game = {
    ...game,
    currentQuestion: game.currentQuestion + 1,
    // Update in case fired fron startGame
    status: "in_progress",
    questionStartTime: new Date(),
    questionTimer: setTimeout(
      createTimerFn(game.id, allConn),
      game.questions[game.currentQuestion + 1].timeLimitSec,
    ),
  };

  const updatedGame = gameState.update(game.id, newGame);

  allConn.forEach((client) => {
    const clWs = client as ExtendedWebSocket;
    if (updatedGame.players.some((p: Player) => p.index === clWs.id)) {
      client.send(
        JSON.stringify({
          type: "question",
          data: formatQuestion(newGame),
          id: 0,
        }),
      );
    }
  });
};
