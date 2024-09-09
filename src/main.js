import "./assets/index.css";

import { createApp } from "vue";
import { createPinia } from "pinia";
import posthogPlugin from "../plugins/posthog";
import App from "./App.vue";

const app = createApp(App);
const pinia = createPinia();
app.use(pinia);

import router from "./router";
app.use(router);

app.use(posthogPlugin);

app.mount("#app");
