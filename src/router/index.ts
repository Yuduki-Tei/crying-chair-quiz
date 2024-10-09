import { createWebHistory, createRouter } from "vue-router";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";
import { useUserStore } from "../store";

const Login = () => import("../views/Login.vue");
const Menu = () => import("../views/Menu.vue");
const Register = () => import("../views/Register.vue");
const Weekly_10 = () => import("../views/Weekly_10.vue");
const Random_10 = () => import("../views/Random_10.vue");
const UserProfile = () => import("../views/UserProfile.vue");
const Result = () => import("../views/Result.vue");
const Cat_10 = () => import("../views/Cat_10.vue");
const Contribution = () => import("../views/Contribution.vue");
const Principle = () => import("../views/Principle.vue");

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
    meta: { requiresAuth: true, requiresUserData: true },
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

  if (requiresUserData && !userStore.isInitialized) {
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
