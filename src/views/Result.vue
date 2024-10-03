<template>
  <Loading v-if="!dataUpdated" />
  <div
    v-if="dataUpdated"
    class="container px-1 d-block justify-content-center pt-5"
    style="max-width: 450px"
  >
    <DropDown />
    <h3 class="pb-2 text-center">
      總分 : <NumberIncrement :total = totalScore :reset = true />
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
import { useRouter } from "vue-router";
import { defineComponent, ref, onMounted } from "vue";
import { useUserStore, useResultStore } from "../store";
import Loading from "../components/Loading.vue";
import DropDown from "../components/DropDown.vue";
import ResultGrid from "../components/ResultGrid.vue";
import QuestionCarousel from "../components/QuestionCarousel.vue";
import NumberIncrement from "../components/NumberIncrement.vue";

export default defineComponent({
  name: "Result",
  components: { ResultGrid, QuestionCarousel, DropDown, Loading, NumberIncrement },
  setup() {
    const user = useUserStore();
    const res = useResultStore();
    const router = useRouter();
    const totalScore = res.total;
    const dataUpdated = ref<boolean>(false);

    const redirectToMenu = async () => {
      router.replace("/menu");
    };

    onMounted(async () => {
      await user.updateResToDatabase();
      await user.updateStatsToDatabase();
      await user.updateRatingToDatabase();
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
