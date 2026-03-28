export const generateGameCode = () => {
  return Math.round(Math.random() * 1000000).toString();
};
