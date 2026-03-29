import { finishGame } from "./finishGame";
import { nextQuestion } from "./nextQuestion";
import { ExtendedWebSocket } from "../types";
import { broadcastAllGameParticipants } from "../utils/broadcastAllGameParticipants";
import { updateGameScores } from "../utils/updateGameScores";

export const completeQuestion = (
  gameId: string,
  allConn: Set<ExtendedWebSocket>,
) => {
  const { playerResults, correctIndex, updatedGame } = updateGameScores(gameId);

  if (updatedGame.currentQuestion === updatedGame.questions.length - 1) {
    finishGame(gameId, allConn);
  } else {
    broadcastAllGameParticipants(
      updatedGame,
      allConn,
      (clConn: ExtendedWebSocket) => {
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
      },
    );

    nextQuestion(gameId, allConn);
  }
};
