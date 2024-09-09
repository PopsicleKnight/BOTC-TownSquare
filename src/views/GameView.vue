<script setup lang="js">
import { computed, onMounted, onUnmounted, watch } from "vue";
import { useRoute } from "vue-router";
import { useGameStore } from "@/stores/game";
import { useUserStore } from "@/stores/user";
import { useStoryTellerStore } from "@/stores/storyTeller";

import { Button } from "@/components/ui/button";

import socketManager from "@/services/socketManager";

import ChooseScript from "@/components/ChooseScript.vue";
import AddPlayers from "@/components/AddPlayers.vue";
import SetupRoles from "@/components/SetupRoles.vue";
import PlayerCircle from "@/components/PlayerCircle.vue";
import GameInfo from "@/components/GameInfo.vue";

const gameStore = useGameStore();
const userStore = useUserStore();
const storyTellerStore = useStoryTellerStore();

const route = useRoute();
const gameId = computed(() => route.params.id);

gameStore.setGameId(gameId.value);

const startGame = () => {
  gameStore.startGame();
};

onMounted(() => {
  socketManager.initializeSocket(gameId.value);
  initializeStores();

  watch(
    () => gameStore.players,
    () => {
      storyTellerStore.syncWithGameStore();
    },
    { deep: true },
  );
});

onUnmounted(() => {
  socketManager.disconnect();
});

const initializeStores = () => {
  storyTellerStore.syncWithGameStore();
};
</script>

<template>
  <div
    v-if="!gameStore.isStarted && userStore.role === 'story-teller'"
    class="storyteller"
  >
    <ChooseScript></ChooseScript>
    <AddPlayers></AddPlayers>
    <SetupRoles v-if="gameStore.script !== null"></SetupRoles>
    <Button @click="startGame">Start the game</Button>
  </div>
  <PlayerCircle></PlayerCircle>
  <div class="game-info-container">
    <GameInfo></GameInfo>
  </div>
</template>

<style scoped lang="scss">
.storyteller {
  display: flex;
  flex-direction: column;
  position: fixed;
  top: 0;
  left: 0;
  padding: 20px;
  z-index: 1;
  gap: 16px;
}

.game-info-container {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 20px;
  z-index: 2;
}

.player-circle-container {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
}
</style>
