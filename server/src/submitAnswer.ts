import gameState from "./gameState";
import { AnswerData, ExtendedWebSocket } from "./types";

export const handleSubmitAnswer = (
  { gameId, questionIndex, answerIndex }: AnswerData,
  conn: ExtendedWebSocket,
  allConn: Set<ExtendedWebSocket>,
) => {
  const game = gameState.getById(gameId);

  ///TODO: add update

  conn.send(
    JSON.stringify({
      type: "answer_accepted",
      data: {
        questionIndex,
      },
      id: 0,
    }),
  );
};
