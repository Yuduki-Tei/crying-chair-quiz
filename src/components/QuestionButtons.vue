<template>
  <div class="col text-center">
    <button
      type="button"
      class="btn btn-danger"
      :disabled="!stopOK"
      v-if="stopOK"
      @click="pauseQuestion"
    >
      我知道 !
    </button>
    <button
      type="button"
      class="btn btn-primary"
      :disabled="!startOK"
      v-if="startOK"
      @click.once ="displayNextQuestion"
    >
      開始
    </button>
    <button
      type="submit"
      class="btn btn-primary"
      :disabled="!answerOK"
      v-if="answerOK"
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
      v-if="nextOK"
      @click="displayNextQuestion"
    >
      <i class="bi bi-arrow-right"></i>
    </button>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, PropType, onMounted, onBeforeUnmount } from "vue";
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
  },
  setup(props) {
    const buttonStatus = useButtonStatusStore();

    const answerOK = computed(() => buttonStatus.answerOK);
    const nextOK = computed(() => buttonStatus.nextOK);
    const stopOK = computed(() => buttonStatus.stopOK);
    const startOK = computed(() => buttonStatus.startOK);

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

    const isMac = navigator.userAgent.toUpperCase().indexOf('MAC') >= 0;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (isMac){
        if (startOK.value && event.key === "Enter") {
            displayNextQuestion();
          } else if (stopOK.value && event.key === "Enter") {
            pauseQuestion();
          } else if (answerOK.value && event.key === "Enter" && (event.metaKey|| event.ctrlKey)) {
            checkAnswer();
          } else if (nextOK.value && event.key === "Enter") {
            displayNextQuestion();
          };
      }else{
        if (event.key === "Enter") {
          if (startOK.value) {
            displayNextQuestion();
          } else if (stopOK.value) {
            pauseQuestion();
          } else if (answerOK.value) {
            checkAnswer();
          } else if (nextOK.value) {
            displayNextQuestion();
          };
        };
      }
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
      pauseQuestion,
      displayNextQuestion,
      checkAnswer,
    };
  },
});
</script>
