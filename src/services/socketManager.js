import { io } from "socket.io-client";
import { useGameStore } from "@/stores/game";
import { useUserStore } from "@/stores/user";
import { watch } from "vue";
import { useStoryTellerStore } from "@/stores/storyTeller";
import emitter from "./emiterManager";
import { v4 as uuidv4 } from "uuid";

class SocketManager {
  constructor() {
    this.gameStore = useGameStore();
    this.userStore = useUserStore();
    this.storyTellerStore = useStoryTellerStore();
    this.socket = null;

    this.localStorageKey = "client-id";
    this.clientId = "";
  }

  initializeSocket(gameId) {
    this.clientId = localStorage.getItem(this.localStorageKey);

    if (!this.clientId) {
      this.clientId = uuidv4();
      localStorage.setItem(this.localStorageKey, this.clientId);
    }

    this.gameStore.setGameId(gameId);

    const port = import.meta.env.VITE_SERVER_BACKEND_PORT || 3000;
    const host = import.meta.env.VITE_BACKEND_URL;
    this.socket = io(`${host}:${port}`, {
      query: { clientId: this.clientId },
    });

    this.socket.on("connect", () => {
      console.log("Connected to the server");
      this.userStore.isConnected = true;
      this.socket.emit("joinRoom", { room: gameId, clientId: this.clientId });
    });

    this.socket.on("disconnect", () => {
      this.userStore.isConnected = false;
      console.log("Disconnected from the server");
    });

    this.socket.on("role", ({ role }) => {
      this.userStore.setRole(role);
      console.log(`You are the ${role}`);
    });

    this.socket.on(
      "gameStarted",
      ({ isStarted, script, gameStartedOn, players }) => {
        this.gameStore.updateGameState({
          isStarted,
          script,
          gameStartedOn,
          players,
        });
      },
    );

    this.socket.on(
      "updateGameState",
      ({ isStarted, script, gameStartedOn, players }) => {
        this.gameStore.updateGameState({
          isStarted,
          script,
          gameStartedOn,
          players,
        });
      },
    );

    this.socket.on("stoodUpFromSeat", (playerName) => {
      this.gameStore.stoodUpFromSeat(playerName);
      console.log(`${playerName} stood up from the seat`);
    });

    this.socket.on("tookSeat", (playerName) => {
      this.gameStore.tookSeat(playerName);
      console.log(`${playerName} took the seat`);
    });

    this.socket.on("assignedRole", (player) => {
      this.gameStore.assignRole(player.name, player.role);
      console.log(`${player.name} has the role: ${player.role}`);
    });

    this.watchStoreChanges();
    this.watchEvents();
  }

  watchEvents() {
    emitter.on("startGame", () => {
      this.socket.emit("startGame", {
        room: this.gameStore.gameId,
        script: this.gameStore.script,
        isStarted: this.gameStore.isStarted,
        gameStartedOn: this.gameStore.gameStartedOn,
        players: this.gameStore.players,
      });

      const roomId = this.gameStore.gameId;
      const privatePlayers = this.storyTellerStore.getPrivatePlayers;

      this.socket.emit("passRoles", {
        room: roomId,
        privatePlayers,
      });
    });

    emitter.on("takeSeat", (playerName) => {
      this.socket.emit("takeSeat", {
        room: this.gameStore.gameId,
        playerName: playerName,
      });
    });

    emitter.on("assignedCharacter", (playerName, character) => {
      this.socket.emit("assignedCharacter", {
        playerName: playerName,
        character: character,
      });
    });
  }

  watchStoreChanges() {
    watch(
      () => this.gameStore.$state,
      (newState) => {
        this.socket.emit("updateGameState", {
          room: newState.gameId,
          script: newState.script,
          isStarted: newState.isStarted,
          gameStartedOn: newState.gameStartedOn,
          players: newState.players,
        });
      },
      { deep: true },
    );
  }

  disconnect() {
    if (this.socket) {
      this.userStore.isConnected = false;
      this.socket.disconnect();
    }
  }
}

const socketManager = new SocketManager();
export default socketManager;
