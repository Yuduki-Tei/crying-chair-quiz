<template>
  <ResultGrid class ="grid" :act="currentIdx" @select-grid="gotoSlide" />
  <div id="questionCarousel" class="carousel slide" data-interval="false">
    <div class="carousel-inner">
      <div
        v-for="(item, idx) in resultQText"
        :key="idx"
        :class="['carousel-item', { active: idx === 0 }]"
      >
        <div
          class="row border m-auto"
          style="min-width: 280px; min-height: 200px"
        >
          <p class="mt-1">{{ item }}</p>
          <div class ="m-auto text-buttom p-0 mb-1">
            <p class="text-center p-0 m-0">
              你的答案: {{ userAns[idx] }}  <br> 預設答案: {{ resultAText[idx] }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref, onMounted, onUnmounted } from "vue";
import { useOnlineQuestionStore, useResultStore } from "../store";
import ResultGrid from "./ResultGrid.vue";

export default defineComponent({
  name: "QuestionCarousel",
  components: { ResultGrid },
  setup() {
    const resultQText = new Array();
    const resultAText = new Array();
    const userAns = new Array();
    const qStore = useOnlineQuestionStore();
    const res = useResultStore();
    const currentIdx = ref(0);
    let carouselInstance = null;

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
      carouselInstance = new bootstrap.Carousel(carouselElement, {
        interval: false,
      });

      const handleSlide = (event) => {
        currentIdx.value = event.to;
      };

      carouselElement.addEventListener("slide.bs.carousel", handleSlide);

      onUnmounted(() => {
        carouselElement.removeEventListener("slide.bs.carousel", handleSlide);
      });
    });

    const gotoSlide = (index) => {
      carouselInstance.to(index);
      currentIdx.value = index;
    };

    return {
      currentIdx,
      resultQText,
      resultAText,
      userAns,
      gotoSlide,
    };
  },
});
</script>

<style scoped>
/* .carousel-control-prev,
.carousel-control-next {
  margin-top: 8rem;
} */
.grid {
  cursor: pointer;
}
</style>
