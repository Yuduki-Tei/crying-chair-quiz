<template>
  <div class="dropdown m-5 position-fixed top-0 end-0 z-3">
    <button
      class="btn btn-secondary dropdown-toggle"
      type="button"
      id="dropdownMenuButton"
      data-bs-toggle="dropdown"
    >
      <i class="bi bi-list"></i>
    </button>
    <ul class="dropdown-menu dropdown-menu-end">
      <li>
        <router-link to="/menu" replace class="dropdown-item">
          <i class="bi bi-house"></i> 主畫面
        </router-link>
      </li>
      <li>
        <router-link to="/user-data" replace class="dropdown-item">
          <i class="bi bi-person"></i> 使用者資料(沒做)
        </router-link>
      </li>
      <li>
        <a class="dropdown-item" href="https://forms.gle/ET5t7LZUfCLfAXqk8"
          ><i class="bi bi-send"></i> 問題回報</a
        >
      </li>
      <li v-if="user"><hr class="dropdown-divider" /></li>
      <li v-if="user">
        <a class="dropdown-item" id="text-danger" href="#" @click="logOut"
          ><i class="bi bi-box-arrow-right"></i> 帳號登出</a
        >
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import { useRouter } from "vue-router";
import { getAuth } from "firebase/auth";
import { useUserStore } from "../store";

export default defineComponent({
  name: "DropDown",
  setup() {
    const auth = getAuth();
    const user = ref(auth.currentUser);
    const userData = useUserStore();
    const router = useRouter();
    const logOut = () => {
      userData.resetStore();
      auth.signOut().then(() => {
        router.push("/login");
      });
    };
    return {
      user,
      logOut,
    };
  },
});
</script>