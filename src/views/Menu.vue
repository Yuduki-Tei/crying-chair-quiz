<template>
  <HelloBanner />
  <div class="container px-4 py-3">
    <div class="d-flex justify-content-center align-content-center">
      <h2 class="text-md-start border-bottom">Menu</h2>
      <DropDown />
    </div>
    <div class="row g-5 py-5 row-cols-1 row-cols-md-3">
      <div class="col d-flex align-items-start">
        <div
          class="icon-square text-body-emphasis d-inline-flex align-items-center justify-content-center fs-3 flex-shrink-0 me-3"
        >
          <i class="bi bi-activity"></i>
        </div>
        <div>
          <h3 class="fs-3 text-body-emphasis">每週十題</h3>
          <p>每週日22:00(UTC+8)更新</p>
          <button
            @click="goToPage('weekly-10')"
            type="button"
            class="btn btn-primary"
          >
            開始挑戰
          </button>
        </div>
      </div>
      <div class="col d-flex align-items-start">
        <div
          class="icon-square text-body-emphasis d-inline-flex align-items-center justify-content-center fs-3 flex-shrink-0 me-3"
        >
          <i class="bi bi-book"></i>
        </div>
        <div>
          <h3 class="fs-3 text-body-emphasis">隨機十題</h3>
          <p>從題庫中隨機抽選10題</p>
          <button
            @click="goToPage('random-10')"
            type="button"
            class="btn btn-primary"
          >
            開始練習
          </button>
        </div>
      </div>
      <div class="col d-flex align-items-start">
        <div
          class="icon-square text-body-emphasis d-inline-flex align-items-center justify-content-center fs-3 flex-shrink-0 me-3"
        >
          <i class="bi bi-boxes"></i>
        </div>
        <div>
          <h3 class="fs-3 text-body-emphasis">分類十題</h3>
          <p>選擇你想要練習的類別</p>
          <button
            @click="goToPage('cat-10')"
            type="button"
            class="btn btn-primary"
          >
            開始練習
          </button>
        </div>
      </div>
      <div class="col d-flex align-items-start">
        <div
          class="icon-square text-body-emphasis d-inline-flex align-items-center justify-content-center fs-3 flex-shrink-0 me-3"
        >
        <i class="bi bi-vector-pen"></i>
        </div>
        <div>
          <h3 class="fs-3 text-body-emphasis">投稿十題</h3>
          <p>開玩笑的 一題也歡迎</p>
          <button
            @click="goToPage('contribution')"
            type="button"
            class="btn btn-primary"
          >
            我要投稿
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { useRouter } from "vue-router";
import DropDown from "../components/DropDown.vue";
import HelloBanner from "../components/HelloBanner.vue";

export default defineComponent({
  name: "Menu",
  components: { DropDown, HelloBanner },
  setup() {
    const router = useRouter();
    const goToPage = (page: string) => {
      router.replace(`/${page}`);
    };

    return {
      goToPage,
    };
  },
});
</script>
