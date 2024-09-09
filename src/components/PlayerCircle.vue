<script setup>
import { onMounted, onUnmounted, ref, computed, watch } from "vue";
import { useGameStore } from "@/stores/game";
import PlayerCard from "./PlayerCard.vue";

const gameStore = useGameStore();
const players = computed(() => gameStore.players);

const DEFAULT_CIRCLE_SIZE = 45;
const circleSize = ref(`${DEFAULT_CIRCLE_SIZE}%`);
const zoom = ref("16vh");

const updateCircleSize = () => {
  const width = window.innerWidth;
  const height = window.innerHeight;
  const smallerDimension = Math.min(width, height);

  circleSize.value = `${Math.min(DEFAULT_CIRCLE_SIZE, ((smallerDimension * (DEFAULT_CIRCLE_SIZE / 100)) / height) * 100)}%`;
};

const calculateZoom = () => {
  const unit = window.innerWidth > window.innerHeight ? "vh" : "vw";

  const zoomLevels = [
    { max: 6, width: 18 },
    { max: 10, width: 16 },
    { max: 15, width: 14 },
    { max: Infinity, width: 12 },
  ];

  const zoomValue = zoomLevels.find(
    (level) => players.value.length <= level.max,
  ).width;

  zoom.value = zoomValue + unit;
};

watch(players, calculateZoom, { immediate: true });

onMounted(() => {
  updateCircleSize();

  window.addEventListener("resize", updateCircleSize);
  window.addEventListener("resize", calculateZoom);
});

onUnmounted(() => {
  window.removeEventListener("resize", updateCircleSize);
  window.addEventListener("resize", calculateZoom);
});
</script>

<template>
  <div class="townsquare">
    <ul class="player-circle" :class="['size-' + players.length]">
      <li
        v-for="player in players"
        :key="player.name"
        :style="{ height: circleSize, width: zoom }"
      >
        <PlayerCard :player="player" />
      </li>
    </ul>
  </div>
</template>

<style lang="scss">
@use "sass:math";

.townsquare {
  position: relative;
  padding: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}

.player-circle {
  padding: 0;
  height: 100%;
  list-style: none;
  margin: 0;

  > li {
    position: absolute;
    left: 50%;
    height: 45%;
    transform-origin: 0 100%;
  }
}
@mixin on-circle($item-count) {
  $angle: math.div(360, $item-count);
  $rot: 0;

  @for $i from 1 through $item-count {
    &:nth-child(#{$i}) {
      transform: rotate($rot * 1deg);
      @if $i - 1 <= math.div($item-count, 2) {
        z-index: $item-count - $i + 1;

        .fold-enter-active,
        .fold-leave-active {
          transform-origin: right center;
        }
        .fold-enter,
        .fold-leave-to {
          transform: perspective(200px) rotateY(-90deg);
        }
      } @else {
        z-index: $i - 1;
      }

      > * {
        transform: rotate($rot * -1deg);
      }

      $q: math.div($item-count, 4);
      $x: $i - 1;
      @if $x < $q or ($x >= math.div($item-count, 2) and $x < $q * 3) {
        .player {
          margin-bottom: -10% + 20% * (1 - math.div($x % $q, $q));
        }
      } @else {
        .player {
          margin-bottom: -10% + 20% * math.div($x % $q, $q);
        }
      }
    }
    $rot: $rot + $angle;
  }
}

@for $i from 1 through 20 {
  .player-circle.size-#{$i} > li {
    @include on-circle($item-count: $i);
  }
}
</style>
