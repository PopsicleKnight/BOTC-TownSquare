// import { Server, Socket } from "socket.io";
// import { RoomData, ClientData, Player } from "./interfaces";

export const rooms = new Map();
export const clientSockets = new Map();

export function socketHandlers(io) {
  io.on("connection", (socket) => {
    console.log(`A user connected: ${socket.id}`);

    socket.on(
      "joinRoom",
      ({ room, clientId }) => {
        console.log(`Socket ${socket.id} joining room: ${room}`);

        if (!rooms.has(room)) {
          rooms.set(room, {
            host: null,
            gameState: {
              room: room,
              script: "",
              isStarted: false,
              gameStartedOn: "",
              players: [],
            },
            players: new Map(),
          });
        }

        clientSockets.set(clientId, {
          socketId: socket.id,
          room,
          clientId: clientId,
        });
        socket.join(room);

        const roomData = rooms.get(room);

        if (roomData) {
          if (!roomData.host) {
            roomData.host = { clientId: clientId, socketId: socket.id };
            socket.emit("role", { role: "story-teller" });
            console.log(
              `Client ${clientId} assigned as story teller for room ${room}`,
            );
          } else if (roomData.host.clientId === clientId) {
            roomData.host = { clientId: clientId, socketId: socket.id };
            socket.emit("role", { role: "story-teller" });
            console.log(
              `Client ${clientId} rejoining as story teller for room ${room}`,
            );
          } else {
            socket.emit("role", { role: "spectator" });
            console.log(
              `Client ${clientId} assigned as spectator for room ${room}`,
            );
          }

          if (roomData.gameState) {
            socket.emit("updateGameState", roomData.gameState);
          }

          const clientsInRoom = io.sockets.adapter.rooms.get(room) || new Set();
          console.log(`Clients in room ${room}:`, Array.from(clientsInRoom));
        }
      },
    );

    socket.on(
      "takeSeat",
      ({ room, playerName }) => {
        console.log(`Player took a seat: ${playerName} in room ${room}`);

        if (rooms.has(room)) {
          const roomData = rooms.get(room);
          const hostId = roomData?.host?.socketId;

          if (socket.id === hostId) {
            console.error(`Host ${playerName} cannot take a seat.`);
            socket.emit("error", {
              message: "You are the host and cannot take a seat.",
            });
            return;
          }

          const existingPlayer = Array.from(
            roomData?.players.values() || [],
          ).find((player) => player.name === playerName);

          if (existingPlayer) {
            console.error(
              `Player with name ${playerName} is already in the room.`,
            );
            return;
          }

          if (roomData?.players.has(socket.id)) {
            console.log(
              `Socket ${socket.id} is already assigned to ${roomData.players.get(socket.id)?.name}.`,
            );
            return;
          }

          io.to(room).emit("tookSeat", playerName);

          roomData?.players.set(socket.id, {
            name: playerName,
            socketId: socket.id,
            role: "",
          });

          console.log(`Current players in room ${room}:`);
          for (const [id, player] of roomData?.players || []) {
            console.log(`Player ID: ${id}, Name: ${player.name}`);
          }
        } else {
          console.error(`Room ${room} does not exist`);
        }
      },
    );

    socket.on("passRoles", (data) => {
      if (!data) {
        console.error("No data received");
        return;
      }

      const { room, privatePlayers } = data;

      if (!room || !privatePlayers || !Array.isArray(privatePlayers)) {
        console.error("Incomplete or invalid data received");
        return;
      }

      console.log(`Passing out roles for room: ${room}`);

      if (rooms.has(room)) {
        const roomData = rooms.get(room);
        if (!roomData) {
          console.error(`Room ${room} not found`);
          return;
        }

        const hostId = roomData.host?.socketId;

        if (socket.id !== hostId) {
          console.error("Only the host can pass out roles");
          socket.emit("error", { message: "Only the host can pass out roles" });
          return;
        }

        privatePlayers.forEach((privatePlayer) => {
          if (
            !privatePlayer ||
            !privatePlayer.player ||
            !privatePlayer.assignedCharacter
          ) {
            console.error("Invalid player data received");
            return;
          }

          // Log all players before attempting to assign roles
          console.log(
            "Current players in room before assigning roles:",
            JSON.stringify(Array.from(roomData.players.values()), null, 2),
          );

          const playerName = privatePlayer.player.name;
          const player = Array.from(roomData.players.values()).find(
            (p) => p.name === playerName,
          );

          if (player) {
            player.role = privatePlayer.assignedCharacter;
            console.log(
              `Assigned role ${privatePlayer.assignedCharacter} to player ${player.name}`,
            );

            const playerSocketId = player.socketId;
            if (playerSocketId) {
              io.to(playerSocketId).emit("assignedRole", {
                name: player.name,
                role: privatePlayer.assignedCharacter,
              });
            } else {
              console.error(
                `Socket ID for player ${player.name} is not available`,
              );
            }
          } else {
            console.error(`Player ${playerName} not found in room ${room}`);
          }
        });
      } else {
        console.error(`Room ${room} does not exist`);
      }
    });

    socket.on("disconnect", () => {
      console.log(`User disconnected: ${socket.id}`);

      const clientData = Array.from(clientSockets.values()).find(
        (client) => client.socketId === socket.id,
      );
      if (clientData) {
        console.log(`User part of room: ${clientData.room}`);
        const roomData = rooms.get(clientData.room);
        if (roomData) {
          if (roomData.players.has(socket.id)) {
            const player = roomData.players.get(socket.id);
            console.log(`Player is: ${player?.name}`);

            roomData.players.delete(socket.id);
            io.to(clientData.room).emit("stoodUpFromSeat", player?.name);
          }
        }

        clientSockets.delete(clientData.clientId);
      }

      io.sockets.adapter.rooms.forEach((room, roomName) => {
        console.log(
          `Clients in room ${roomName} after disconnect:`,
          Array.from(room),
        );
      });
    });

    socket.on(
      "startGame",
      ({
        room,
        script,
        isStarted,
        gameStartedOn,
        players,
      }) => {
        console.log(`The game has started on ${gameStartedOn}`);

        const roomData = rooms.get(room);
        if (roomData) {
          roomData.gameState = {
            room,
            isStarted,
            script,
            gameStartedOn,
            players,
          };
          socket.broadcast.to(room).emit("updateGameState", roomData.gameState);
        }
      },
    );

    socket.on(
      "updateGameState",
      ({
        room,
        script,
        isStarted,
        gameStartedOn,
        players,
      }) => {
        const thisRoomData = rooms.get(room);
        const hostId = thisRoomData?.host?.socketId;

        if (socket.id !== hostId) {
          socket.emit("error", {
            message: "Only the host can update the game state",
          });
          return;
        }

        console.log(`The game state has changed`);
        console.log(
          "updateGameState",
          JSON.stringify(
            {
              room,
              script,
              isStarted,
              gameStartedOn,
              players: players.map((player) => ({
                ...player,
              })),
            },
            null,
            2,
          ),
        );

        const roomData = rooms.get(room);
        if (roomData) {
          roomData.gameState = {
            room,
            isStarted,
            script,
            gameStartedOn,
            players,
          };
          socket.broadcast.to(room).emit("updateGameState", roomData.gameState);
        }
      },
    );
  });
}
