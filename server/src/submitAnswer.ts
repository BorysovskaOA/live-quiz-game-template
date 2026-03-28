import { completeQuestion } from "./completeQuestion";
import gameState from "./gameState";
import { AnswerData, ExtendedWebSocket, Game } from "./types";

export const handleSubmitAnswer = (
  { gameId, questionIndex, answerIndex }: AnswerData,
  conn: ExtendedWebSocket,
  allConn: Set<ExtendedWebSocket>,
) => {
  const game = gameState.getById(gameId);

  if (!game.questionStartTime) {
    throw new Error("Invalid questionStartDate");
  }

  const timeRemaining = Math.abs(
    new Date().getTime() - game.questionStartTime.getTime(),
  );
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
