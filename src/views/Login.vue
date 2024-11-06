<template>
  <Loading v-if="loading" message = "帳號資訊處理中..."/>
  <div
    class="container d-flex justify-content-center align-items-center pt-5"
    style="max-width: 450px"
  >
    <div class="col form-signin m-auto p-auto w-100">
      <form v-if="!loading" @submit.prevent="handleLogin">
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
          <label for="floatingInput" class = "info-text">Email address</label>
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
          <label for="floatingPassword" class = "info-text">Password</label>
        </div>
        <div class="text-start my-3">
          <p>
            還沒有帳號嗎?
            <router-link class = "link" to="/register" replace>點此註冊</router-link> 或
            <a class = "link" @click="loginWithGoogle"
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
import { defineComponent, ref } from "vue";
import { useRouter } from "vue-router";
import Loading from "../components/Loading.vue";
import {
  getAuth,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";

export default defineComponent({
  name: "Login",
  components: { Loading },
  setup() {
    const redirectToMenu =() => {
      router.replace("/menu");
    };

    const loading = ref(true); //to control pgae display
    const router = useRouter();
    const auth = getAuth();

    if (auth.currentUser && auth.currentUser.emailVerified) { //already logged in and email verified
        redirectToMenu();
    } else {
        loading.value = false;
    }

    const errorMessage = ref("");
    const email = ref("");
    const password = ref(""); // init display

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

    return {
      email,
      password,
      loading,
      handleLogin,
      errorMessage,
      loginWithGoogle,
    };
  },
});
</script>
