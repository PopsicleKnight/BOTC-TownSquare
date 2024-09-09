import { rooms } from "../sockets/socketHandler.js";

export function setupApiRoutes(app) {
  app.get("/v0/game/:gameId/overview", (req, res) => {
    const { gameId } = req.params;

    if (!gameId) {
      return res.status(400).json({ error: "Game ID is required" });
    }

    const roomData = rooms[gameId];

    if (!roomData) {
      return res.status(404).json({ error: "Game not found" });
    }

    const response = {
      gameId: gameId,
      isStarted: roomData.isStarted,
      gameStartedOn: roomData.gameStartedOn,
      script: roomData.script, // Include script if it's part of the room data
      players: Array.from(roomData.players || []), // Convert Set to Array if needed
    };

    res.json(response);
  });

  app.get("/", (req, res) => {
    res.send("Hello from Express!");
  });
}
