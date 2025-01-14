<template>
  <ResultGrid class="grid" :act="currentIdx" @select-grid="gotoSlide" />
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
          <div class="m-auto text-buttom p-0 mb-1">
            <p class="text-center p-0 m-0">
              你的答案: {{ userAns[idx] }}  <br> 預設答案: {{ resultAText[idx] }}
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
  <QuestionButtons 
    :curInd="currentIdx" 
    @good="buttonGood(currentIdx)" 
    @bad="buttonBad(currentIdx)" 
  />
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, onUnmounted } from "vue";
import { useQuestionStore, useResultStore, useQuestionStateStore } from "../store";
import { buttonGood, buttonBad } from "../composables";
import Carousel from 'bootstrap/js/dist/carousel';
import ResultGrid from "./ResultGrid.vue";
import QuestionButtons from "./QuestionButtons.vue";

export default defineComponent({
  name: "QuestionCarousel",
  components: { ResultGrid, QuestionButtons },
  setup() {
    const resultQText = ref<string[]>([]);
    const resultAText = ref<string[]>([]);
    const userAns = ref<string[]>([]);
    const qStore = useQuestionStore();
    const res = useResultStore();
    const button = useQuestionStateStore();
    const currentIdx = ref<number>(0);
    let carouselInstance: Carousel | null = null;

    button.disableAll();
    button.rateOK = true;

    for (let i = 0; i < 10; i++) {
      const question = qStore.getQuestion(i);
      const result = res.getRes(i);
      const qTxt = question.q_text;
      const aTxt = question.q_answer[0];
      const uAns = result.answer;
      const interval = result.interval;

      resultQText.value.push(
        qTxt.slice(0, interval) + "／" + qTxt.slice(interval)
      );
      resultAText.value.push(aTxt);
      userAns.value.push(uAns);
    }

    onMounted(() => {
      const carouselElement = document.querySelector("#questionCarousel") as HTMLElement;
      carouselInstance = new Carousel(carouselElement, {
        interval: false,
      });

      const handleSlide = (event: Event) => {
        const target = event.target as HTMLElement;
        const activeIndex = Array.from(target.parentNode!.children).indexOf(target);
        currentIdx.value = activeIndex;
      };

      carouselElement.addEventListener("slide.bs.carousel", handleSlide);

      onUnmounted(() => {
        carouselElement.removeEventListener("slide.bs.carousel", handleSlide);
      });
    });

    const gotoSlide = (index: number) => {
      if (carouselInstance) {
        carouselInstance.to(index);
        currentIdx.value = index;
      }
    };

    return {
      currentIdx,
      resultQText,
      resultAText,
      userAns,
      gotoSlide,
      buttonGood,
      buttonBad,
    };
  },
});
</script>

<style scoped>
.carousel-control-prev,
.carousel-control-next {
  margin-top: 9rem;
}
.grid {
  cursor: pointer;
}
</style>