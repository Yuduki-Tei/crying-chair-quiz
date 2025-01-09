import { createWebHistory, createRouter } from "vue-router";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";

import Login from "../views/Login.vue";
import Menu from "../views/Menu.vue";
import Register from "../views/Register.vue";
import Weekly_10 from "../views/Weekly_10.vue";
import Random_10 from "../views/Random_10.vue";
import UserProfile from "../views/UserProfile.vue";
import Result from "../views/Result.vue";
import Cat_10 from "../views/Cat_10.vue";
import Contribution from "../views/Contribution.vue";
import Principle from "../views/Principle.vue";
import Battle_10 from "../views/Battle_10.vue";

// route for production environment
const routes = [
  { path: "/", component: Login },
  { path: "/login", component: Login },
  { path: "/register", component: Register },
  { path: "/menu", component: Menu, meta: { requiresAuth: true } },
  {
    path: "/weekly-10",
    component: Weekly_10,
    meta: { requiresAuth: true, fromMenu: true },
  },
  {
    path: "/random-10",
    component: Random_10,
    meta: { requiresAuth: true, fromMenu: true },
  },
  {
    path: "/cat-10",
    component: Cat_10,
    meta: { requiresAuth: true, fromMenu: true },
  },
  {
    path: "/battle-10",
    component: Battle_10,
    meta: { requiresAuth: true},
  },
  {
    path: "/user-data",
    component: UserProfile,
    meta: { requiresAuth: true },
  },
  {
    path: "/result",
    component: Result,
    meta: { requiresAuth: true },
  },
  {
    path: "/contribution",
    component: Contribution,
    meta: { requiresAuth: true },
  },
  { path: "/contribution/principle", component: Principle },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach(async (to: any, from: any) => {
  const requiresAuth = to.matched.some(
    (record: any) => record.meta.requiresAuth
  );

  const user = await new Promise<User | null>((resolve) => {
    onAuthStateChanged(getAuth(), (user) => resolve(user));
  });

  const notAuthenticated = !user || !user.emailVerified;

  if (requiresAuth && notAuthenticated) {
    console.error("尚未登入，重導向至登入畫面。");
    return { path: "/login" };
  }

  const fromMenu = to.matched.some((record: any) => record.meta.fromMenu);
  if (fromMenu && from.path !== "/menu") {
    console.error("錯誤的路徑遷移，重導向至主畫面。");
    return { path: "/menu" };
  }

  return true;
});

export default router;
