<template>
  <Loading v-if="!dataUpdated" />
  <div
    v-if="dataUpdated"
    class="container px-1 d-block justify-content-center pt-5"
    style="max-width: 450px"
  >
    <DropDown />
    <h3 class="pb-2 text-center">
        <i :class="{
          'text-correct': totalScore >= 300,
          'text-normal': 300 > totalScore && totalScore >= 150,
          'text-incorrect': 150 > totalScore && totalScore >= 50,
          'text-low': totalScore < 50}">
          總分 : {{ totalScore }}
        </i>
      </h3>
    <QuestionCarousel />
    <div class="col text-center mt-4">
      <button type="button" class="btn btn-primary" @click="redirectToMenu">
        回主畫面
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from "vue";
import { useUserStore, useResultStore } from "../store";
import Loading from "../components/Loading.vue";
import DropDown from "../components/DropDown.vue";
import ResultGrid from "../components/ResultGrid.vue";
import QuestionCarousel from "../components/QuestionCarousel.vue";
import { useRouter } from "vue-router";

export default defineComponent({
  name: "Result",
  components: { ResultGrid, QuestionCarousel, DropDown, Loading },
  setup() {
    const user = useUserStore();
    const res = useResultStore();
    const router = useRouter();
    const totalScore = ref<number>(0);
    const dataUpdated = ref<boolean>(false);

    for (let i = 0; i < res.dataList.length; i++){
      totalScore.value += res.getRes(i).point;
    };

    const redirectToMenu = async () => {
      router.replace("/menu");
    };

    onMounted(async () => {
      // await user.updateResToDatabase();
      // await user.updateStatsToDatabase();
      await user.updateLastActiveTime();
      user.snapShoot();
      dataUpdated.value = true;
    });
    return {
      totalScore,
      dataUpdated,
      redirectToMenu,
    };
  },
});
</script>
