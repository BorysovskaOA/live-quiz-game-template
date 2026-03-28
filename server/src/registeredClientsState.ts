import { RegisteredClient } from "./types";

const registeredClients: RegisteredClient[] = [];

const getByConnectionId = (connId: string) => {
  const client = registeredClients.find((c) => c.connectionId === connId);

  if (!client) {
    throw new Error("Client is not registered");
  }

  return client;
};

const register = (client: RegisteredClient) => {
  registeredClients.push(client);
};

export default {
  register,
  getByConnectionId,
};
