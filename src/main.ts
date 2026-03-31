import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import router from "./router";
import "./validation/rules";

createApp(App).use(router).mount("#app");
