<script setup>
import { ref } from "vue";
import router from "@/router/index";
import { useGameStore } from "@/stores/game";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const name = ref(useGameStore().gameId);

function submitGameId() {
  useGameStore().setGameId(name.value);
  router.push({ name: "Game", params: { id: name.value } });
}
</script>

<template>
  <h2>Welcome to the Townsquare</h2>
  <p>
    Please give a name to your new game. This is the name your players will use
    to join your game.
  </p>
  <Input v-model.trim="name" />
  <Button @click="submitGameId">Create Game</Button>
</template>
