import { nextQuestion } from "./nextQuestion";
import { ExtendedWebSocket, StartGameData } from "./types";

export const handleStartGame = (
  { gameId }: StartGameData,
  _: ExtendedWebSocket,
  allConn: Set<ExtendedWebSocket>,
) => {
  nextQuestion(gameId, allConn);
};
