import { Game, CreateGameData, ExtendedWebSocket } from "../types";
import gameState from "../states/gameState";
import { generateGameCode } from "../utils/generateGameCode";

export const handleCreateGame = (
  { questions }: CreateGameData,
  conn: ExtendedWebSocket,
) => {
  if (
    questions.some(
      (q) =>
        q.options.length !== 4 ||
        q.correctIndex > 4 ||
        q.correctIndex < 0 ||
        q.timeLimitSec < 1, // At least one second to be able to answer
    )
  ) {
    throw new Error("Invalid input");
  }

  const game: Game = {
    id: crypto.randomUUID(),
    code: generateGameCode(),
    questions: questions,
    hostId: conn.id,
    players: [],
    currentQuestion: -1,
    status: "waiting",
    playerAnswers: new Map(),
  };

  gameState.add(game);

  conn.send(
    JSON.stringify({
      type: "game_created",
      data: {
        gameId: game.id,
        code: game.code,
      },
      id: 0,
    }),
  );
};
