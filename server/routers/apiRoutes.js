import { rooms } from "../sockets/socketHandler.js";

export function setupApiRoutes(fastify) {
  fastify.get("/v0/game/:gameId/overview", async (req, reply) => {
    const { gameId } = req.params;
    if (!gameId) {
      return reply.status(400).send({ error: "Game ID is required" });
    }

    const roomData = rooms[gameId];
    if (!roomData) {
      return reply.status(404).send({ error: "Game not found" });
    }

    const response = {
      gameId: gameId,
      isStarted: roomData.isStarted,
      gameStartedOn: roomData.gameStartedOn,
      script: roomData.script, 
      players: Array.from(roomData.players || []),
    };

    return reply.send(response);
  });

  fastify.get("/", async (req, reply) => {
    return reply.send("Hello from Fastify!");
  });
}
