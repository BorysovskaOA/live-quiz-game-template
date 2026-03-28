import { Game, CreateGameData, ExtendedWebSocket } from "./types";
import gameState from "./gameState";
import { generateGameCode } from "./utils/generateGameCode";

export const handleCreateGame = (
  { questions }: CreateGameData,
  conn: ExtendedWebSocket,
) => {
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
