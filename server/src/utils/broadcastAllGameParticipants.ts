import { ExtendedWebSocket, Game, Player } from "../types";

export const broadcastAllGameParticipants = (
  game: Game,
  allConn: Set<ExtendedWebSocket>,
  callback: (clConn: ExtendedWebSocket) => void,
) => {
  allConn.forEach((clConn) => {
    if (
      game.players.some((p: Player) => p.index === clConn.id) ||
      game.hostId === clConn.id
    ) {
      callback(clConn);
    }
  });
};
