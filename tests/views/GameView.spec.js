import { describe, it, expect } from "vitest";
import { shallowMount } from "@vue/test-utils";
import { createRouter, createMemoryHistory } from "vue-router";
import GameComponent from "@/views/GameView.vue";

describe("GameComponent", () => {
  const createRouterWithRoute = (path) => {
    const router = createRouter({
      history: createMemoryHistory(),
      routes: [
        { path: "/", name: "home" },
        { path: "/game/:id", name: "Game", component: GameComponent },
      ],
    });

    router.push(path);
    return router.isReady().then(() => router);
  };

  it("renders the correct gameId based on the route", async () => {
    const router = await createRouterWithRoute("/game/StoryTeller");

    const wrapper = shallowMount(GameComponent, {
      global: {
        plugins: [router],
      },
    });

    expect(wrapper.text()).toContain("Welcome to Game: StoryTeller");
  });

  it("renders the correct gameId for a different route", async () => {
    const router = await createRouterWithRoute("/game/AnotherGame");

    const wrapper = shallowMount(GameComponent, {
      global: {
        plugins: [router],
      },
    });

    expect(wrapper.text()).toContain("Welcome to Game: AnotherGame");
  });

  it("handles routes without gameId gracefully", async () => {
    const router = await createRouterWithRoute("/game/");

    const wrapper = shallowMount(GameComponent, {
      global: {
        plugins: [router],
      },
    });

    expect(wrapper.text()).toContain("Welcome to Game:"); // Handles empty gameId
  });
});
