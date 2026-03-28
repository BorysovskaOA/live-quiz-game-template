import { Game } from "../types";

export const formatQuestion = (game: Game) => {
  return {
    questionNumber: game.currentQuestion,
    totalQuestions: game.questions.length,
    text: game.questions[game.currentQuestion].text,
    options: game.questions[game.currentQuestion].options,
    timeLimitSec: game.questions[game.currentQuestion].timeLimitSec,
  };
};
