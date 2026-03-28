import { finishGame } from "../finishGame";
import { nextQuestion } from "../nextQuestion";
import gameState from "../gameState";
import { ExtendedWebSocket, Player, PlayerResult } from "../types";
import { createScoreboard } from "./createScoreboard";
import { updateGameScores } from "./updateGameScores";

const BASE_POINTS = 1000;

export const createTimerFn =
  (gameId: string, allConn: Set<ExtendedWebSocket>) => () => {
    const { playerResults, correctIndex, updatedGame } =
      updateGameScores(gameId);

    if (updatedGame.currentQuestion === updatedGame.questions.length - 1) {
      finishGame(gameId, allConn);
    } else {
      allConn.forEach((clConn) => {
        if (updatedGame.players.some((p: Player) => p.index === clConn.id)) {
          clConn.send(
            JSON.stringify({
              type: "question_result",
              data: {
                questionIndex: updatedGame.currentQuestion,
                correctIndex: correctIndex,
                playerResults,
              },
              id: 0,
            }),
          );
        }
      });

      nextQuestion(gameId, allConn);
    }
  };
