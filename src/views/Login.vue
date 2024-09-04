<template>
  <Loading v-if="loading" />
  <div
    class="container d-flex justify-content-center align-items-center pt-5"
    style="max-width: 450px"
  >
    <div class="col form-signin m-auto p-auto w-100">
      <form v-if="notLogedin && !loading" @submit.prevent="handleLogin">
        <h1 class="h3 mb-3 fw-normal">登入</h1>
        <div v-if="errorMessage" class="alert alert-danger pt-1 pb-1">
          {{ errorMessage }}
        </div>
        <div class="form-floating">
          <input
            type="email"
            class="form-control"
            id="floatingInput"
            placeholder="name@example.com"
            v-model="email"
            autocomplete="on"
            required
          />
          <label for="floatingInput">Email address</label>
        </div>
        <div class="form-floating">
          <input
            type="password"
            class="form-control"
            id="floatingPassword"
            placeholder="Password"
            v-model="password"
            autocomplete="on"
            required
          />
          <label for="floatingPassword">Password</label>
        </div>
        <div class="text-start my-3">
          <p>
            還沒有帳號嗎?
            <router-link to="/register" replace>點此註冊</router-link> 或
            <a @click="loginWithGoogle"
              ><i class="bi bi-google"></i>登入</a
            >
          </p>
        </div>
        <button class="btn btn-primary w-100 py-2" type="submit">
          Sign in
        </button>
      </form>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useUserStore } from "../store";
import Loading from "../components/Loading.vue";
import {
  getAuth,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
} from "firebase/auth";

export default defineComponent({
  name: "Login",
  components: { Loading },
  setup() {
    const errorMessage = ref("");
    const notLogedin = ref(false);
    const loading = ref(true);
    const email = ref("");
    const password = ref("");
    const router = useRouter();
    const route = useRoute();
    const auth = getAuth();
    const userData = useUserStore();

    onMounted(() => {
      onAuthStateChanged(auth, (user) => {
        if (user && user.emailVerified && (route.path === "/login" || route.path === "/")) {
          redirectToMenu();
        } else {
          notLogedin.value = true;
          loading.value = false;
        }
      });
    });

    const handleLogin = async () => {
      errorMessage.value = "";
      loading.value = true;
      try {
        let userCredential = await signInWithEmailAndPassword(auth, email.value, password.value);
        if (userCredential.user.emailVerified) {
          redirectToMenu();
        } else {
          await auth.signOut();
          loading.value = false;
          errorMessage.value = "請先完成電子信箱驗證。";
        }
      } catch (error) {
        loading.value = false;
        password.value = "";
        errorMessage.value = "錯誤的帳號或密碼";
        console.error("Error logging in:", error);
      }
    };

    const loginWithGoogle = async () => {
      errorMessage.value = "";
      loading.value = true;
      try {
        const provider = new GoogleAuthProvider();
        await signInWithPopup(auth, provider);
        redirectToMenu();
      } catch (error) {
        loading.value = false;
        password.value = "";
        errorMessage.value = "Error logging in with Google";
        console.error("Error logging in with Google:", error);
      }
    };

    const redirectToMenu = async () => {
      await userData.checkUserAccount();
      router.replace("/menu");
    };

    return {
      email,
      password,
      loading,
      notLogedin,
      handleLogin,
      errorMessage,
      loginWithGoogle,
    };
  },
});
</script>
