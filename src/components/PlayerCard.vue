<script setup lang="js">
import CharacterToken from "./CharacterToken.vue";
import { useGameStore } from "@/stores/game";
import { useStoryTellerStore } from "@/stores/storyTeller";
import { computed } from "vue";
import Label from "./ui/label/Label.vue";

const gameStore = useGameStore();
const storyTellerStore = useStoryTellerStore();

const props = defineProps({
  player: {
    type: Object,
    required: true,
  },
});

const role = computed(() => {
  const player = gameStore.findPlayerByName(props.player.name);
  if (player.role != null && player.role != "") return player.role;

  const privatePlayer = storyTellerStore.findPlayerByName(props.player.name);
  return privatePlayer ? privatePlayer.assignedCharacter : null;
});

const takeSeat = () => {
  gameStore.takeSeat(props.player.name);
};
</script>

<template>
  <div class="player">
    <CharacterToken :role="role" class="token" />
    <Label
      @click="takeSeat"
      :class="{ seated: props.player.isSeated }"
      class="playerName"
    >
      {{ props.player.name }}
    </Label>
  </div>
</template>

<style scoped>
.seated {
  color: red;
}

.token {
  display: flex;
  justify-content: center;
  width: 100%;
  aspect-ratio: 1 / 1;
}

.playerName {
  display: flex;
  justify-content: center;
  width: 100%;
}
</style>
