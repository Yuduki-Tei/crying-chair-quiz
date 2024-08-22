<template>
  <div class="col text-center">
    <button
      type="button"
      class="btn btn-danger"
      :disabled="!stopOK"
      v-if="stopOK"
      @click="pauseQuestion"
    >
      Stop
    </button>
    <button
      type="button"
      class="btn btn-primary"
      :disabled="!startOK"
      v-if="startOK"
      @click.once ="displayNextQuestion"
    >
      Start
    </button>
    <button
      type="submit"
      class="btn btn-primary"
      :disabled="!answerOK"
      v-if="answerOK"
      @click ="checkAnswer"
    >
      Answer
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

    const answerOK = computed(() => buttonStatus.isCountingDown);
    const nextOK = computed(
      () => buttonStatus.isEnd && buttonStatus.isSessionStarted
    );
    const stopOK = computed(() => buttonStatus.isAsking);
    const startOK = computed(
      () => buttonStatus.isEnd && buttonStatus.isSessionNotStarted
    );

    const pauseQuestion = () => {
      buttonStatus.displayQuestion();
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
      if (event.key === "Enter") {
        if (startOK.value) {
          displayNextQuestion();
        } else if (stopOK.value) {
          pauseQuestion();
        } else if (answerOK.value) {
          if (isMac) {
            if (event.metaKey || event.ctrlKey) {
              checkAnswer();
            };
          } else {
            checkAnswer();
          };
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
      pauseQuestion,
      displayNextQuestion,
      checkAnswer,
    };
  },
});
</script>
