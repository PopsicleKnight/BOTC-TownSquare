<script setup>
import { RouterView } from "vue-router";
import posthog from "posthog-js";
import { useColorMode } from "@vueuse/core";

posthog.onFeatureFlags(function () {
  if (posthog.isFeatureEnabled("custom-scripts")) {
    console.log("custom scripts are enabled.");
  }
});

useColorMode({
  initialValue: "dark",
});
</script>

<template>
  <header></header>
  <main class="main">
    <RouterView />
  </main>
  <footer></footer>
</template>

<style>
html,
body {
  height: 100%;
  overflow: hidden;
}

.parent {
  height: 100%;
}

.child {
  height: 100%;
}

#app {
  height: 100%;
}

.main {
  height: 100%;
}
</style>
