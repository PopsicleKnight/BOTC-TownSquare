import { defineStore } from "pinia";
import { useGameStore } from "./game";

export const useStoryTellerStore = defineStore("storyTeller", {
  state: () => ({
    selectedRoles: [],
    privatePlayers: [],
  }),
  getters: {
    getPrivatePlayers(state) {
      return state.privatePlayers;
    },
    findPlayerByName: (state) => (playerName) => {
      return state.privatePlayers.find(
        (player) => player.player.name === playerName,
      );
    },
  },
  actions: {
    initializePrivatePlayers(gamePlayers) {
      this.privatePlayers = gamePlayers.map((player) => ({
        player: player,
        assignedCharacter:
          this.findPlayerByName(player.name)?.assignedCharacter || {},
      }));
    },

    assignCharacterToPlayer(playerName, character) {
      const player = this.findPlayerByName(playerName);
      if (player) {
        player.assignedCharacter = character;
      }
    },

    updatePlayer(updatedPlayer) {
      const player = this.findPlayerByName(updatedPlayer.name);
      if (player) {
        player.player = updatedPlayer;
      } else {
        this.privatePlayers.push({
          player: updatedPlayer,
          assignedCharacter: {},
        });
      }
    },

    syncWithGameStore() {
      const gameStore = useGameStore();

      gameStore.players.forEach((gamePlayer) => {
        this.updatePlayer(gamePlayer);
      });

      this.privatePlayers = this.privatePlayers.filter((storyTellerPlayer) =>
        gameStore.players.some(
          (gamePlayer) => gamePlayer.name === storyTellerPlayer.player.name,
        ),
      );
    },

    assignCharacters() {
      const shuffledPlayers = this.shuffleArray(this.getPrivatePlayers);
      const shuffledRoles = this.shuffleArray(this.selectedRoles);

      shuffledPlayers.forEach((privatePlayer, index) => {
        let role = shuffledRoles[index];
        this.assignCharacterToPlayer(privatePlayer.player.name, role);
      });
    },

    shuffleArray(array) {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
      return array;
    },
  },
});
