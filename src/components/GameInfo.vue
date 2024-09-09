<script setup lang="js">
import { ref, watch, onMounted, onUnmounted } from "vue";
import { useGameStore } from "@/stores/game";
import { useUserStore } from "@/stores/user";

import dataManager from "@/services/dataManager";

const gameStore = useGameStore();
const userStore = useUserStore();

const elapsedTime = ref("");

const updateElapsedTime = () => {
  if (!gameStore.gameStartedOn) {
    elapsedTime.value = "0 seconds ago";
    return;
  }

  const now = new Date();
  const elapsedMillis = now - new Date(gameStore.gameStartedOn);
  const elapsedSeconds = Math.floor(elapsedMillis / 1000);
  const elapsedMinutes = Math.floor(elapsedSeconds / 60);
  const elapsedHours = Math.floor(elapsedMinutes / 60);

  if (elapsedSeconds < 60) {
    elapsedTime.value = `${elapsedSeconds} second(s) ago`;
  } else if (elapsedMinutes < 60) {
    elapsedTime.value = `${elapsedMinutes} minute(s) ago`;
  } else {
    elapsedTime.value = `${elapsedHours} hour(s), ${elapsedMinutes - elapsedHours * 60} minute(s) ago`;
  }
};

let intervalId;
let selectedScript = ref({});

onMounted(() => {
  watch(
    () => gameStore.isStarted,
    (newValue) => {
      if (newValue) {
        intervalId = setInterval(() => {
          updateElapsedTime();
        }, 1000);
      } else {
        if (intervalId) clearInterval(intervalId);
      }
    },
  );
  watch(
    () => gameStore.script,
    (newValue) => {
      selectedScript.value = dataManager.getEditionFromEditionId(newValue);
    },
  );
});

onUnmounted(() => {
  if (intervalId) clearInterval(intervalId);
});
</script>

<template>
  <div v-if="gameStore.isStarted">
    <p>
      The game has started on
      {{ new Date(gameStore.gameStartedOn).toLocaleTimeString() }} ({{
        elapsedTime
      }})
    </p>
  </div>
  <p>
    WebSocket connection status:
    {{ userStore.isConnected ? "Connected" : "Disconnected" }}
  </p>
  <p>Your role is: {{ userStore.role }}</p>
  <p v-if="gameStore.script !== ''">
    The selected script is: {{ selectedScript.name }}
  </p>
  <p v-else>No script has been selected yet.</p>
  <p v-if="gameStore.players.length == 0">No players have been selected.</p>
</template>

<style></style>
