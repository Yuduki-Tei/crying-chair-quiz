<template>
  <div
    class="container px-1 py-1 d-block justify-content-center"
    style="max-width: 450px"
  >
  <div class="col text-center">
    <button
      type="button"
      class="btn btn-danger"
      :disabled="!stopOK"
      v-show="stopOK"
      @click="pauseQuestion"
    >
      我知道 !
    </button>
    <button
      type="button"
      class="btn btn-primary"
      :disabled="!startOK"
      v-show="startOK"
      @click.once ="displayNextQuestion"
    >
      開始
    </button>
    <button
      type="button"
      class="btn btn-primary"
      :disabled="!answerOK"
      v-show="answerOK"
      @click ="checkAnswer"
    >
      回答
    </button>
  </div>
  <div class="col text-end">
    <button
      type="button"
      class="btn btn-primary"
      :disabled="!nextOK"
      v-show="nextOK"
      @click="displayNextQuestion"
    >
      <i class="bi bi-arrow-right"></i>
    </button>
    </div>
    <button
        type="button"
        class="btn btn-primary"
        :disabled="!hintOK"
        v-show="hintOK && answerOK"
        @click.once ="getOneWord"
      >
        <span class="icon-stack">
          <i class="bi bi-search icon-stack-main"></i>
          <i class="icon-stack-sub fw-bold">1</i>
        </span>
      </button>
      <button
        type="button"
        class="btn btn-primary"
        :disabled="!plusOK"
        v-show="plusOK && answerOK"
        @click.once ="plusTime"
      >
        <span class="icon-stack fw-bold">
          <i class="bi bi-clock icon-stack-main"></i>
          <i class="icon-stack-sub fw-bold ms-1">+</i>
        </span>
      </button>
    </div>
</template>

<script lang="ts">
import { defineComponent, computed, PropType, onMounted, onBeforeUnmount, ref } from "vue";
import { useButtonStatusStore } from "../store";

export default defineComponent({
  name: "QuestionButtons",
  props: {
    onPause: {
      type: Function as PropType<() => void>,
      default: null,
    },
    onNext: {
      type: Function as PropType<() => void>,
      default: null,
    },
    onAnswer: {
      type: Function as PropType<() => void>,
      default: null,
    },
    onHint:{
      type: Function as PropType<() => void>,
      default: null,
    },
    onPlustime:{
      type: Function as PropType<() => void>,
      default: null,
    },
  },
  setup(props) {
    const buttonStatus = useButtonStatusStore();

    const answerOK = computed(() => buttonStatus.answerOK);
    const nextOK = computed(() => buttonStatus.nextOK);
    const stopOK = computed(() => buttonStatus.stopOK);
    const startOK = computed(() => buttonStatus.startOK);
    const hintOK = ref(true);
    const plusOK = ref(true);

    const pauseQuestion = () => {
      buttonStatus.pauseQuestion();
      props.onPause && props.onPause();
    };

    const displayNextQuestion = () => {
      buttonStatus.displayQuestion();
      props.onNext && props.onNext();
    };

    const checkAnswer = () => {
      buttonStatus.submitAnswer();
      props.onAnswer && props.onAnswer();
    };

    const getOneWord = () => {
      hintOK.value = false;
      props.onHint && props.onHint();
    };

    const plusTime = () => {
      plusOK.value = false;
      props.onPlustime && props.onPlustime();
    };

    const isMac = navigator.userAgent.toUpperCase().indexOf('MAC') >= 0;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Enter") {
        event.preventDefault();
        if (startOK.value) {
          displayNextQuestion();
        } else if (stopOK.value) {
          pauseQuestion();
        } else if (answerOK.value && !isMac) {
          checkAnswer();
        } else if (answerOK.value && isMac && (event.metaKey|| event.ctrlKey)){
          checkAnswer();
        } else if (nextOK.value) {
          displayNextQuestion();
        };
      };
    };

    onMounted(() => {
      window.addEventListener("keydown", handleKeyDown);
    });

    onBeforeUnmount(() => {
      window.removeEventListener("keydown", handleKeyDown);
    });
    return {
      answerOK,
      nextOK,
      stopOK,
      startOK,
      hintOK,
      plusOK,
      pauseQuestion,
      displayNextQuestion,
      checkAnswer,
      getOneWord,
      plusTime,
    };
  },
});
</script>

<style scoped>
.icon-stack {
  position: relative;
  display: inline-block;
  width: 1.2rem;
  height: 1.2rem;
  line-height: 2rem;
}
.icon-stack-main,
.icon-stack-sub {
  position: absolute;
}
.icon-stack-main {
  left: 50%;
  top: 70%; 
  transform: translate(-50%, -50%);
  font-size: 1.5rem;
}
.icon-stack-sub {
  left: 100%;
  top: 10%;
  transform: translate(-50%, -50%);
}
</style>