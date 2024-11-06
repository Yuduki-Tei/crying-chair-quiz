<template>
  <Loading 
    v-if="!buttonActivate" 
    :message= "successMessage || '帳號資訊處理中... '"
  />
  <div
    class="container d-flex justify-content-center align-items-center pt-5"
    style="max-width: 450px"
  >
    <div v-if="buttonActivate" class="form-signin m-auto p-auto w-100">
      <h1 class="h3 mb-3 fw-normal">註冊帳號</h1>
      <form @submit.prevent="handleRegister">
        <div v-if="errorMessage" class="alert alert-danger override pt-1 pb-1">
          {{ errorMessage }}
        </div>
        <div v-if="successMessage" class="alert alert-primary pt-1 pb-1">
          {{ successMessage }}
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
        <div class="form-floating">
          <input
            type="password"
            class="form-control"
            id="floatingConfirm"
            placeholder="Confirm Password"
            v-model="confirm"
            autocomplete="on"
            required
          />
          <label for="floatingPassword" class = "info-text">Confirm Password</label>
        </div>
        <div class="text-start my-3">
          <p>
            已經有帳號了嗎?
            <router-link class = "link" to="/login" replace>點此登入</router-link>
          </p>
        </div>
        <button class="btn btn-primary w-100 py-2" type="submit">註冊</button>
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
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from "firebase/auth";

export default defineComponent({
  name: "Register",
  components: { Loading },
  setup() {
    const email = ref<string>("");
    const password = ref<string>("");
    const confirm = ref<string>("");
    const router = useRouter();
    const auth = getAuth();
    const errorMessage = ref<string>("");
    const successMessage = ref<string>("");
    const buttonActivate = ref(true); // value will become false when data processing/loading to prevent mutiple request

    const handleRegister = async () => {
      if (password.value !== confirm.value) {
        errorMessage.value = "密碼與驗證不一致";
        password.value = "";
        confirm.value = "";
        return;
      }
      buttonActivate.value = false;

      try {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email.value,
          password.value
        );
        await sendEmailVerification(userCredential.user);
        successMessage.value = "註冊成功，請驗證信箱。";
        setTimeout(() => {
          auth.signOut().then(() => {
            router.replace("/login");
          });
        }, 3000);
      } catch (error) {
        if (error instanceof Error) {
          buttonActivate.value = true;
          errorMessage.value = error.message;
          password.value = "";
          confirm.value = "";
        } else {
          errorMessage.value = "An unknown error occurred";
        }
        console.error("Error registering user:", error);
      }
    };
    return {
      email,
      password,
      confirm,
      errorMessage,
      successMessage,
      handleRegister,
      buttonActivate,
    };
  },
});
</script>
