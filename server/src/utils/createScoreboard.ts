import { Game } from "../types";

export const createScoreboard = (game: Game) => {
  return structuredClone(game)
    .players.sort((a, b) => b.score - a.score)
    .map((p, index) => ({
      name: p.name,
      score: p.score,
      rank: index + 1,
    }));
};
