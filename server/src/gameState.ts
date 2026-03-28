import { Game } from "./types";

let games: Game[] = [];

const getById = (id: string) => {
  const game = games.find((g) => g.id === id);

  if (!game) {
    throw new Error("Invalid game");
  }

  return game;
};

const getByCode = (code: string) => {
  const game = games.find((g) => g.code === code);

  if (!game) {
    throw new Error("Invalid game");
  }

  return game;
};

const add = (game: Game) => {
  games.push(game);

  return game;
};

const update = (id: string, game: Game) => {
  games = games.map((g) => (g.id === id ? game : g));

  return game;
};

export default {
  getById,
  getByCode,
  add,
  update,
};
