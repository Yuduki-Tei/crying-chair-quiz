import { createApp } from "vue";
import { createPinia } from "pinia";
import { createPersistedState } from "pinia-plugin-persistedstate";
import { setupFirebase } from "./services/firebase.ts";
import App from "./App.vue";
import router from "./router";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "./new_style.css";

setupFirebase;
const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
pinia.use(createPersistedState());

app.use(router);

app.mount("#app");
