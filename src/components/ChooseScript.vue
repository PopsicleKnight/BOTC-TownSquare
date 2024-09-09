<script setup lang="js">
import tbImage from "@/assets/editions/tb.png";
import bmrImage from "@/assets/editions/bmr.png";
import snvImage from "@/assets/editions/snv.png";
import customImage from "@/assets/editions/custom.png";

import { useGameStore } from "@/stores/game";

import posthog from "posthog-js";

import { ref } from "vue";

import { Button } from "@/components/ui/button";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const gameStore = useGameStore();

const script = ref("");
const isCustomScriptEnabled = ref(false);

const refreshFeatureFlags = async () => {
  isCustomScriptEnabled.value =
    await posthog.isFeatureEnabled("custom-scripts");
};

const selectScript = (selectedScript) => {
  script.value = selectedScript;
};

const saveScript = () => {
  gameStore.script = script;
};
</script>

<template>
  <Dialog
    @update:open="
      (open) => {
        if (open) refreshFeatureFlags();
      }
    "
  >
    <DialogTrigger>
      <Button>Choose A Script</Button>
    </DialogTrigger>
    <DialogContent class="dialog-content">
      <DialogHeader as-child>
        <DialogTitle>Choose your script</DialogTitle>
        <DialogDescription>
          Please select the script you would like to play
        </DialogDescription>
      </DialogHeader>
      <div class="dialog-body">
        <ul class="card-list">
          <li
            @click="selectScript('tb')"
            :class="['card', { selected: script === 'tb' }]"
            :style="{
              backgroundImage: `url(${tbImage})`,
              backgroundSize: 'contain',
              backgroundRepeat: 'no-repeat',
            }"
          ></li>
          <li
            @click="selectScript('bmr')"
            :class="['card', { selected: script === 'bmr' }]"
            :style="{
              backgroundImage: `url(${bmrImage})`,
              backgroundSize: 'contain',
              backgroundRepeat: 'no-repeat',
            }"
          ></li>
          <li
            @click="selectScript('snv')"
            :class="['card', { selected: script === 'snv' }]"
            :style="{
              backgroundImage: `url(${snvImage})`,
              backgroundSize: 'contain',
              backgroundRepeat: 'no-repeat',
            }"
          ></li>
          <li
            v-show="isCustomScriptEnabled"
            @click="selectScript('custom')"
            :class="['card', { selected: script === 'custom' }]"
            :style="{
              backgroundImage: `url(${customImage})`,
              backgroundSize: 'contain',
              backgroundRepeat: 'no-repeat',
            }"
          ></li>
        </ul>
      </div>
      <DialogFooter>
        <DialogTrigger as-child>
          <Button variant="outline">Cancel</Button>
        </DialogTrigger>
        <DialogTrigger as-child>
          <Button type="button" @click="saveScript">Save</Button>
        </DialogTrigger>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>

<style scoped>
.card-list {
  list-style-type: none;
  padding: 0;
  display: flex;
  gap: 20px;
  padding: 5px;
}

.card {
  width: 150px;
  height: 200px;
  background-size: cover;
  background-position: center;
  position: relative;
  border-radius: 10px;
  overflow: hidden;
  cursor: pointer;
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  padding: 10px;
}

.card:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 15px;
}

.selected {
  transform: scale(1.05);
  border: 3px solid hsl(var(--primary));
  box-shadow: 0 0 10px hsl(var(--shadow-light));
}

.dialog-content {
  display: flex;
  flex-direction: column;
  max-width: max-content;
  overflow: hidden;
  padding: 20px;
}

.dialog-body {
  overflow-x: auto;
  padding: 10px 0;
}
</style>
