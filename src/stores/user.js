import { defineStore } from "pinia";

export const useUserStore = defineStore("user", {
  state: () => ({
    role: "",
    isConnected: false,
  }),
  actions: {
    setRole(role) {
      this.role = role;
    },
  },
});
