import { completeQuestion } from "./completeQuestion";
import gameState from "../states/gameState";
import { AnswerData, ExtendedWebSocket, Game } from "../types";
import { getCurrentGameQuestion } from "../utils/getCurrentGameQuestion";
import { SECOND } from "../constants";

export const handleSubmitAnswer = (
  { gameId, questionIndex, answerIndex }: AnswerData,
  conn: ExtendedWebSocket,
  allConn: Set<ExtendedWebSocket>,
) => {
  const game = gameState.getById(gameId);

  if (!game.questionStartTime) {
    throw new Error("Invalid questionStartDate");
  }

  const timeDiff = Math.abs(
    new Date().getTime() - game.questionStartTime.getTime(),
  );
  const timeRemaining =
    getCurrentGameQuestion(game).timeLimitSec * SECOND - timeDiff;
  const newGame: Game = {
    ...game,
    playerAnswers: new Map(game.playerAnswers).set(conn.id, {
      answerIndex,
      timeRemaining,
    }),
  };

  const updatedGame = gameState.update(game.id, newGame);

  conn.send(
    JSON.stringify({
      type: "answer_accepted",
      data: {
        questionIndex,
      },
      id: 0,
    }),
  );

  if (updatedGame.questions.length === updatedGame.playerAnswers.size) {
    clearTimeout(updatedGame.questionTimer);
    completeQuestion(gameId, allConn);
  }
};
