<template>
  <ResultGrid :act="currentIdx" />
  <div id="questionCarousel" class="carousel slide" data-interval="false">
    <div class="carousel-indicators mb-0 mt-0">
      <button
        v-for="(item, index) in resultQText"
        :key="index"
        :data-bs-target="'#questionCarousel'"
        :data-bs-slide-to="index"
        :class="{ active: index === 0 }"
      ></button>
    </div>
    <div class="carousel-inner">
      <div
        v-for="(item, idx) in resultQText"
        :key="idx"
        :class="['carousel-item', { active: idx === 0 }]"
      >
        <div
          class="row border m-auto"
          style="min-width: 280px; min-height: 180px"
        >
          <p class="mt-1">{{ item }}</p>
          <div class ="m-auto text-buttom">
            <p class="text-center p-0 mb-0">
              你的答案: {{ userAns[idx] }}  預設答案: {{ resultAText[idx] }}
            </p>
          </div>
        </div>
      </div>
    </div>
    <button
      class="carousel-control-prev h-25"
      type="button"
      data-bs-target="#questionCarousel"
      data-bs-slide="prev"
    >
      <span class="carousel-control-prev-icon"></span>
    </button>
    <button
      class="carousel-control-next h-25"
      type="button"
      data-bs-target="#questionCarousel"
      data-bs-slide="next"
    >
      <span class="carousel-control-next-icon"></span>
    </button>
  </div>
</template>

<script>
import { defineComponent, ref, onMounted, onUnmounted } from "vue";
import { useQuestionStore, useResultStore } from "../store";
import ResultGrid from "./ResultGrid.vue";

export default defineComponent({
  name: "QuestionCarousel",
  components: { ResultGrid },
  setup() {
    const resultQText = new Array();
    const resultAText = new Array();
    const userAns = new Array();
    const qStore = useQuestionStore();
    const res = useResultStore();
    const currentIdx = ref(0);

    for (let i = 0; i < 10; i++) {
      let qTxt = qStore.getQuestion(i).q_text;
      let aTxt = qStore.getQuestion(i).q_answer[0];
      let uAns = res.getRes(i).answer;
      let interval = res.getRes(i).interval;
      resultQText.push(
        qTxt.slice(0, interval) + "／" + qTxt.slice(interval)
      );
      resultAText.push(aTxt);
      userAns.push(uAns);
    }
    onMounted(() => {
      const carouselElement = document.querySelector("#questionCarousel");

      const handleSlide = (event) => {
        currentIdx.value = event.to;
      };

      carouselElement.addEventListener("slide.bs.carousel", handleSlide);

      onUnmounted(() => {
        carouselElement.removeEventListener("slide.bs.carousel", handleSlide);
      });
    });
    return {
      currentIdx,
      resultQText,
      resultAText,
      userAns,
    };
  },
});
</script>

<style scoped>
.carousel-control-prev,
.carousel-control-next {
  margin-top: 8rem;
}
</style>
