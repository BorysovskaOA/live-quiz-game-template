import { Game } from "../types";

export const getCurrentGameQuestion = (game: Game) => {
  return game.questions[game.currentQuestion];
};
