<script setup lang="js">
import { computed } from "vue";

const props = defineProps({
  role: {
    type: Object,
    default: () => ({}),
  },
});

const reminderLeaves = computed(() => {
  return (props.role.reminders || []).length;
});

const getImage = (role) => {
  return new URL(`../assets/roles/${role.id}.png`, import.meta.url).href;
};

const emit = defineEmits(["set-role"]);
const setRole = () => {
  emit("set-role");
};
</script>

<template>
  <div class="token" @click="setRole" :class="[props.role.id]">
    <span
      class="icon"
      v-if="props.role.id"
      :style="{
        backgroundImage: `url(${getImage(props.role)})`,
      }"
    ></span>

    <span
      class="leaf-left"
      v-if="props.role.firstNight || props.role.firstNightReminder"
    ></span>
    <span
      class="leaf-right"
      v-if="props.role.otherNight || props.role.otherNightReminder"
    ></span>
    <span v-if="reminderLeaves" :class="['leaf-top' + reminderLeaves]"></span>
    <span class="leaf-orange" v-if="props.role.setup"></span>

    <svg viewBox="0 0 150 150" class="name">
      <path
        d="M 13 75 C 13 160, 138 160, 138 75"
        id="curve"
        fill="transparent"
      />
      <text
        width="150"
        x="66.6%"
        text-anchor="middle"
        class="label mozilla"
        font-size="90%"
      >
        <textPath xlink:href="#curve">
          {{ props.role.name }}
        </textPath>
      </text>
    </svg>

    <div
      class="edition"
      :class="[`edition-${props.role.edition}`, props.role.team]"
    ></div>

    <div class="ability" v-if="props.role.ability">
      {{ props.role.ability }}
    </div>
  </div>
</template>

<style scoped lang="scss">
.token {
  position: relative;
  border-radius: 50%;
  width: 100%;
  height: 100%;
  background: url("../assets/grimoire/token.png") center center;
  background-size: 100%;
  text-align: center;
  border: 3px solid black;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: border-color 250ms;

  &:hover .name .label {
    stroke: black;
    fill: white;

    @-moz-document url-prefix() {
      &.mozilla {
        stroke: none;
        filter: drop-shadow(0 1.5px 0 black) drop-shadow(0 -1.5px 0 black)
          drop-shadow(1.5px 0 0 black) drop-shadow(-1.5px 0 0 black)
          drop-shadow(0 2px 2px rgba(0, 0, 0, 0.5));
      }
    }
  }

  .icon,
  &:before {
    background-size: 100%;
    background-repeat: no-repeat;
    background-position: center 30%;
    position: absolute;
    width: 100%;
    height: 100%;
    margin-top: 3%;
  }

  span {
    position: absolute;
    width: 100%;
    height: 100%;
    background-size: 100%;
    pointer-events: none;

    &.leaf-left {
      background-image: url("../assets/grimoire/leaf-left.png");
    }

    &.leaf-orange {
      background-image: url("../assets/grimoire/leaf-orange.png");
    }

    &.leaf-right {
      background-image: url("../assets/grimoire/leaf-right.png");
    }

    &.leaf-top1 {
      background-image: url("../assets/grimoire/leaf-top1.png");
    }

    &.leaf-top2 {
      background-image: url("../assets/grimoire/leaf-top2.png");
    }

    &.leaf-top3 {
      background-image: url("../assets/grimoire/leaf-top3.png");
    }

    &.leaf-top4 {
      background-image: url("../assets/grimoire/leaf-top4.png");
    }

    &.leaf-top5 {
      background-image: url("../assets/grimoire/leaf-top5.png");
    }
  }

  .name {
    width: 100%;
    height: 100%;
    font-size: 24px;

    .label {
      fill: black;
      stroke: white;
      stroke-width: 2px;
      paint-order: stroke;
      font-family: "Papyrus", serif;
      font-weight: bold;
      text-shadow: 0 2px 2px rgba(0, 0, 0, 0.2);
      letter-spacing: 1px;

      @-moz-document url-prefix() {
        &.mozilla {
          stroke: none;
          text-shadow: none;
          filter: drop-shadow(0 1.5px 0 white) drop-shadow(0 -1.5px 0 white)
            drop-shadow(1.5px 0 0 white) drop-shadow(-1.5px 0 0 white)
            drop-shadow(0 2px 2px rgba(0, 0, 0, 0.5));
        }
      }
    }
  }

  .edition {
    position: absolute;
    right: 0;
    bottom: 5px;
    width: 30px;
    height: 30px;
    background-size: 100%;
    display: none;
  }

  .ability {
    display: flex;
    position: absolute;
    padding: 5px 10px;
    left: 120%;
    width: 250px;
    z-index: 25;
    font-size: 80%;
    background: rgba(0, 0, 0, 0.5);
    border-radius: 10px;
    border: 3px solid black;
    filter: drop-shadow(0 4px 6px rgba(0, 0, 0, 0.5));
    text-align: left;
    justify-items: center;
    align-content: center;
    align-items: center;
    pointer-events: none;
    opacity: 0;
    transition: opacity 200ms ease-in-out;

    &:before {
      content: " ";
      border: 10px solid transparent;
      width: 0;
      height: 0;
      border-right-color: black;
      position: absolute;
      margin-right: 2px;
      right: 100%;
    }
  }

  &:hover .ability {
    opacity: 1;
  }
}
</style>
