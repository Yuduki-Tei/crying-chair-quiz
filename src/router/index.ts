import { createWebHistory, createRouter } from "vue-router";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";
import { useUserStore } from "../store";

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

// route for local development
// const routes = [
//   { path: "/", component: Login },
//   { path: "/login", component: Login },
//   { path: "/register", component: Register },
//   { path: "/menu", component: Menu },
//   { path: "/weekly-10", component: Weekly_10 },
//   { path: "/random-10", component: Random_10 },
//   { path: "/cat-10", component: Cat_10 },
//   { path: "/user-data", component: UserProfile },
//   { path: "/leaderboard", component: Menu },
//   { path: "/result", component: Result },
//   { path: "/contribution", component: Contribution },
//   { path: "/contribution/principle", component: Principle },
// ];

// route for production environment
const routes = [
  { path: "/", component: Login },
  { path: "/login", component: Login },
  { path: "/register", component: Register },
  { path: "/menu", component: Menu, meta: { requiresAuth: true } },
  {
    path: "/weekly-10",
    component: Weekly_10,
    meta: { requiresAuth: true, requiresUserData: true },
  },
  {
    path: "/random-10",
    component: Random_10,
    meta: { requiresAuth: true, requiresUserData: true },
  },
  {
    path: "/cat-10",
    component: Cat_10,
    meta: { requiresAuth: true, requiresUserData: true },
  },
  {
    path: "/user-data",
    component: UserProfile,
    meta: { requiresAuth: true, requiresUserData: true },
  },
  { path: "/leaderboard", component: Menu, meta: { requiresAuth: true } },
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

router.beforeEach(async (to: any, _: any) => {
  const requiresAuth = to.matched.some(
    (record: any) => record.meta.requiresAuth
  );

  const user = await new Promise<User | null>((resolve) => {
    onAuthStateChanged(getAuth(), (user) => resolve(user));
  });

  const notAuthenticated = !user || !user.emailVerified;

  if (requiresAuth && notAuthenticated) {
    return { path: "/login" };
  }

  const requiresUserData = to.matched.some(
    (record: any) => record.meta.requiresUserData
  );
  const userStore = useUserStore();

  if (requiresUserData) {
    try {
      await userStore.checkUserAccount();
    } catch (error) {
      console.error("資料載入失敗", error);
      return { path: "/menu" };
    }
  }

  return true;
});

export default router;
