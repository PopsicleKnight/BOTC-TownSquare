<script setup>
import { ref } from "vue";
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

const emit = defineEmits(["addedPlayer"]);

const playerName = ref("");

const clearPlayerName = () => {
  playerName.value = "";
};

const submitDialog = () => {
  if (playerName.value.trim()) {
    emit("addedPlayer", playerName.value);
    playerName.value = "";
  } else {
    console.log("Player name cannot be empty");
  }
};
</script>

<template>
  <Dialog
    @update:open="
      (open) => {
        if (!open) clearPlayerName();
      }
    "
  >
    <DialogTrigger as-child>
      <Button>Create A Player</Button>
    </DialogTrigger>
    <DialogContent class="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Name Your Player</DialogTitle>
        <DialogDescription>
          Choose the name for the player you want to add. You can change the
          name later
        </DialogDescription>
      </DialogHeader>
      <Input v-model="playerName" placeholder="Enter player name" />
      <DialogFooter>
        <DialogTrigger as-child>
          <Button variant="outline">Cancel</Button>
        </DialogTrigger>
        <DialogTrigger as-child>
          <Button type="button" @click="submitDialog">Save</Button>
        </DialogTrigger>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>

<style scoped></style>
