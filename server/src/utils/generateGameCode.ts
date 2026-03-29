import crypto from "node:crypto";

export const generateGameCode = () => {
  return crypto
    .randomBytes(6)
    .toString("base64")
    .replace(/[/+=]/g, "")
    .substring(0, 6)
    .toUpperCase();
};
