import { defineStore } from "pinia";
import emitter from "../services/emiterManager";

export const useGameStore = defineStore("game", {
  state: () => ({
    gameId: "",
    storyTeller: "",
    script: "",
    isStarted: false,
    gameStartedOn: null,
    players: [],
  }),
  actions: {
    setGameId(id) {
      this.gameId = id;
    },
    addPlayer(playerName) {
      let player = this.findPlayerByName(playerName);
      if (player) return;

      this.players.push({ name: playerName, isSeated: false, role: "" });
    },
    clearPlayers() {
      this.players = [];
    },
    removePlayer(playerName) {
      this.players = this.players.filter(
        (player) => player.name !== playerName,
      );
    },
    renamePlayer(oldName, newName) {
      this.removePlayer(oldName);
      this.addPlayer(newName);
    },
    findPlayerByName(playerName) {
      return this.players.find((player) => player.name === playerName);
    },
    takeSeat(playerName) {
      let player = this.findPlayerByName(playerName);
      if (!player) return;

      emitter.emit("takeSeat", playerName);
    },
    tookSeat(playerName) {
      let player = this.findPlayerByName(playerName);
      if (!player) return;

      player.isSeated = true;
    },
    stoodUpFromSeat(playerName) {
      let player = this.findPlayerByName(playerName);
      if (!player) return;

      player.isSeated = false;

      emitter.emit("stoodUpFromSeat", playerName);
    },
    startGame() {
      this.isStarted = true;
      this.gameStartedOn = new Date();

      emitter.emit("startGame");
    },
    setScript(script) {
      this.script = script;
    },
    updateGameState(newState) {
      const { isStarted, script, gameStartedOn, players } = newState;

      if (
        this.isStarted !== isStarted ||
        this.script !== script ||
        this.gameStartedOn !== gameStartedOn ||
        JSON.stringify(this.players) !== JSON.stringify(players)
      ) {
        this.isStarted = isStarted;
        this.script = script;
        this.gameStartedOn = gameStartedOn;

        const newPlayersMap = new Map(players.map((p) => [p.name, p]));

        this.players = this.players.filter((existingPlayer) => {
          if (!newPlayersMap.has(existingPlayer.name)) {
            return false;
          }

          const newPlayer = newPlayersMap.get(existingPlayer.name);
          if (!existingPlayer.role) {
            existingPlayer.role = newPlayer.role;
          }

          return true;
        });

        players.forEach((newPlayer) => {
          if (!this.players.find((p) => p.name === newPlayer.name)) {
            this.players.push(newPlayer);
          }
        });
      }
    },
    assignRole(playerName, role) {
      let player = this.findPlayerByName(playerName);
      if (!player) return;

      player.role = role;
    },
  },
});
