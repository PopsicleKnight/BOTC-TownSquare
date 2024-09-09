<script setup>
import { ref } from "vue";
import { useGameStore } from "@/stores/game";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip";

const gameStore = useGameStore();

const playerCount = ref(5);
const playerCountString = ref(playerCount.value.toString());
const playerNames = ref(Array(playerCount.value).fill(""));

const initializePlayerSetup = () => {
  const initialPlayerCount = gameStore.players.length || 5;
  playerCount.value = initialPlayerCount;
  playerCountString.value = initialPlayerCount.toString();
  if (gameStore.players.length > 0)
    playerNames.value = gameStore.players.map((player) => player.name);
};

const updatePlayerCount = (newCount) => {
  const newCountInt = parseInt(newCount);

  if (newCountInt > playerCount.value) {
    playerNames.value = [
      ...playerNames.value,
      ...Array(newCountInt - playerCount.value).fill(""),
    ];
  }
  playerCount.value = newCountInt;
};

const submitDialog = () => {
  playerNames.value = playerNames.value.slice(0, playerCount.value);

  const validNames = playerNames.value.filter((name) => name.trim());

  if (validNames.length === playerCount.value) {
    gameStore.clearPlayers();

    playerNames.value.forEach((player) => {
      gameStore.addPlayer(player);
    });
  } else {
    console.log("All player names must be filled out");
  }
};
</script>

<template>
  <Dialog
    @update:open="
      (open) => {
        if (open) initializePlayerSetup();
      }
    "
  >
    <TooltipProvider :delayDuration="300">
      <Tooltip :disabled="gameStore.script !== ''">
        <TooltipTrigger>
          <DialogTrigger as-child>
            <Button
              :disabled="gameStore.script === ''"
              :style="{ width: '100%' }"
              >Add Players</Button
            >
          </DialogTrigger>
        </TooltipTrigger>
        <TooltipContent>
          <p>Please select a script first</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
    <DialogContent class="max-w-[600px]">
      <DialogHeader>
        <DialogTitle>Set Up Players</DialogTitle>
        <DialogDescription>
          Choose the number of players and assign names.
        </DialogDescription>
      </DialogHeader>
      <div class="mb-4">
        <Label for="player-count">Number of players:</Label>
        <Select
          v-model="playerCountString"
          @update:modelValue="updatePlayerCount"
        >
          <SelectTrigger id="player-count">
            <SelectValue placeholder="Select number of players" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem
              v-for="n in 16"
              :key="n + 4"
              :value="(n + 4).toString()"
              >{{ n + 4 }}</SelectItem
            >
          </SelectContent>
        </Select>
      </div>
      <div class="grid grid-cols-2 gap-4">
        <div
          v-for="(name, index) in playerNames.slice(0, playerCount)"
          :key="index"
          class="flex items-center"
        >
          <Label class="mr-1">Player {{ index + 1 }}:</Label>
          <Input v-model="playerNames[index]" placeholder="Enter player name" />
        </div>
      </div>

      <DialogFooter class="mt-4">
        <DialogTrigger as-child>
          <Button variant="outline">Cancel</Button>
        </DialogTrigger>
        <DialogTrigger as-child>
          <Button type="button" @click="submitDialog">Save All</Button>
        </DialogTrigger>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>

<style scoped>
.grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}
</style>
