import "./assets/index.css";

import { createApp } from "vue";
import App from "./App.vue";
const app = createApp(App);

import posthogPlugin from "../plugins/posthog";

import { createPinia } from "pinia";
const pinia = createPinia();
app.use(pinia);

import router from "./router";
app.use(router);

app.use(posthogPlugin);

app.mount("#app");
