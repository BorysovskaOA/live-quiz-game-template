import { RegData, ExtendedWebSocket } from "./types.js";
import registeredClientsState from "./registeredClientsState.js";

export const handleClientRegistration = (
  data: RegData,
  conn: ExtendedWebSocket,
) => {
  registeredClientsState.register({
    name: data.name,
    password: data.password,
    connectionId: conn.id,
  });

  conn.send(
    JSON.stringify({
      type: "reg",
      data: {
        name: data.name,
        index: conn.id,
      },
      id: 0,
    }),
  );
};
