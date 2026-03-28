import crypto from "node:crypto";
import { Game, Player, Question } from "./types";

const games: Game[] = [];

const generateGameCode = () => {
  return Math.round(Math.random() * 1000000).toString();
};

export const createGame = (questions: Question[], hostId: string) => {
  const game: Game = {
    id: crypto.randomUUID(),
    code: generateGameCode(),
    questions: questions,
    hostId: hostId,
    players: [],
    currentQuestion: -1,
    status: "waiting",
    playerAnswers: new Map(),
  };

  games.push(game);

  return game;
};

export const addPlayer = (
  code: string,
  client: { name: string; password: string },
  playerId: string,
) => {
  const game = games.find((g) => g.code === code);

  if (!game) {
    throw new Error("Invalid game code");
  }

  const player: Player = {
    name: client.name,
    index: playerId,
    score: 0,
  };
  game.players.push(player);

  return {
    name: player.name,
    gameId: game.id,
    gamePlayers: game.players,
  };
};
