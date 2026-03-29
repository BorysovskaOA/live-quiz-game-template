import { completeQuestion } from "./completeQuestion";
import gameState from "../states/gameState";
import { ExtendedWebSocket, Game, Player } from "../types";
import { broadcastAllGameParticipants } from "../utils/broadcastAllGameParticipants";
import { formatQuestion } from "../utils/formatQuestion";
import { SECOND } from "../constants";

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
      () => {
        completeQuestion(gameId, allConn);
      },
      game.questions[game.currentQuestion + 1].timeLimitSec * SECOND,
    ),
  };

  const updatedGame = gameState.update(game.id, newGame);

  broadcastAllGameParticipants(
    updatedGame,
    allConn,
    (clConn: ExtendedWebSocket) => {
      clConn.send(
        JSON.stringify({
          type: "question",
          data: formatQuestion(newGame),
          id: 0,
        }),
      );
    },
  );
};
