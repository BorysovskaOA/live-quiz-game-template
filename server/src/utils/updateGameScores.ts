import gameState from "../gameState";
import { Player, PlayerResult } from "../types";

const BASE_POINTS = 1000;

export const updateGameScores = (gameId: string) => {
  const game = gameState.getById(gameId);
  const correctIndex = game.questions[game.currentQuestion].correctIndex;

  const playerResults: PlayerResult[] = [];
  const updatedPlayers: Player[] = [];

  game.players.forEach((p) => {
    const playerAnswer = game.playerAnswers.get(p.index);
    const isCorrectAnswer = correctIndex === playerAnswer?.answerIndex;
    const pointsEarned = isCorrectAnswer
      ? BASE_POINTS *
        (playerAnswer.timeRemaining /
          game.questions[game.currentQuestion].timeLimitSec)
      : 0;

    updatedPlayers.push({
      ...p,
      score: p.score + pointsEarned,
    });

    playerResults.push({
      name: p.name,
      answered: !!playerAnswer,
      correct: isCorrectAnswer,
      pointsEarned: pointsEarned,
      totalScore: BASE_POINTS,
    });
  });

  const updatedGame = gameState.update(game.id, {
    ...game,
    players: updatedPlayers,
    questionStartTime: undefined,
    questionTimer: undefined,
    playerAnswers: new Map(),
  });

  return {
    playerResults,
    correctIndex,
    updatedGame,
  };
};
