import { nextQuestion } from "./nextQuestion";
import { ExtendedWebSocket, StartGameData } from "../types";
import gameState from "../states/gameState";

export const handleStartGame = (
  { gameId }: StartGameData,
  conn: ExtendedWebSocket,
  allConn: Set<ExtendedWebSocket>,
) => {
  const game = gameState.getById(gameId);

  if (game.hostId !== conn.id) {
    throw new Error("Only host can start the game");
  }

  nextQuestion(gameId, allConn);
};
