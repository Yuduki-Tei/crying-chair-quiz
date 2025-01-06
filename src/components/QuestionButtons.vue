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
        @click.once="displayNextQuestion"
      >
        開始
      </button>
    </div>

    <div class="d-flex justify-content-between align-items-center mt-2">
      <div class="col text-start">
        <button
          type="button"
          class="btn btn-outline-light me-2"
          v-show="rateOK"
          :disabled="!rateOK"
          @click="giveGood"
        >
          <i
            :class="
              userRating === 'good'
                ? 'bi bi-hand-thumbs-up-fill'
                : 'bi bi-hand-thumbs-up'
            "
          ></i>
        </button>
        <button
          type="button"
          class="btn btn-outline-danger"
          v-show="rateOK"
          :disabled="!rateOK"
          @click="giveBad"
        >
          <i
            :class="
              userRating === 'bad'
                ? 'bi bi-hand-thumbs-down-fill'
                : 'bi bi-hand-thumbs-down'
            "
          ></i>
        </button>
      </div>
      <div class="col text-end">
        <button
          type="button"
          class="btn btn-primary"
          v-show="nextOK"
          :disabled="!nextOK"
          @click="displayNextQuestion"
        >
          <i class="bi bi-arrow-right"></i>
        </button>
      </div>
    </div>

    <div
      class="d-flex"
      :class="{
        'justify-content-between': funcsOK,
        'justify-content-center': !funcsOK,
      }"
    >
      <div v-show="funcsOK" class="d-flex align-items-center">
        <button
          type="button"
          class="btn btn-outline-light me-2"
          :disabled="!hintOK"
          v-show="funcsOK"
          @click.once="getOneWord"
        >
          <span class="icon-stack">
            <i class="bi bi-search icon-stack-main"></i>
            <i class="icon-stack-sub fw-bold">1</i>
          </span>
        </button>
        <button
          type="button"
          class="btn btn-outline-light me-2"
          :disabled="!plusTimeOK"
          v-show="funcsOK"
          @click.once="plusTime"
        >
          <span class="icon-stack fw-bold">
            <i class="bi bi-hourglass-split icon-stack-main"></i>
            <i class="icon-stack-sub fw-bold ms-1">+</i>
          </span>
        </button>
        <button
          type="button"
          class="btn btn-outline-light me-2"
          :disabled="!plusTextOK"
          v-show="funcsOK"
          @click.once="plusText"
        >
          <span class="icon-stack fw-bold">
            <i class="bi bi-eye icon-stack-main"></i>
            <i class="icon-stack-sub fw-bold ms-1">+</i>
          </span>
        </button>
      </div>

      <button
        type="button"
        class="btn btn-primary"
        :disabled="!answerOK"
        v-show="answerOK"
        @click="checkAnswer"
      >
        回答
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  computed,
  PropType,
  onMounted,
  onBeforeUnmount,
} from "vue";
import { useQuestionStateStore, useUserStore, useSocketStore } from "../store";

export default defineComponent({
  name: "QuestionButtons",
  props: {
    curInd: { type: Number, default: 0 },
    curAns:{ type: String, default: ''},
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
    onHint: {
      type: Function as PropType<() => void>,
      default: null,
    },
    onPlusTime: {
      type: Function as PropType<() => void>,
      default: null,
    },
    onPlusText: {
      type: Function as PropType<() => void>,
      default: null,
    },
    onGood: {
      type: Function as PropType<(arg0: number) => void>,
      default: null,
    },
    onBad: {
      type: Function as PropType<(arg0: number) => void>,
      default: null,
    },
  },
  setup(props) {
    const qState = useQuestionStateStore();
    const user = useUserStore();
    const socket = useSocketStore();

    const userRating = computed(() =>
      user.getUserRate(Math.min(Math.max(props.curInd, 0), 9))
    );
    const answerOK = computed(() => qState.answerOK);
    const nextOK = computed(() => qState.nextOK);
    const stopOK = computed(() => qState.stopOK);
    const startOK = computed(() => qState.startOK);
    const rateOK = computed(() => qState.rateOK);
    const hintOK = computed(() => qState.hintOK && !qState.isWeekly);
    const plusTimeOK = computed(() => qState.plusTimeOK && !qState.isWeekly);
    const plusTextOK = computed(() => qState.plusTextOK && !qState.isWeekly);
    const funcsOK = computed(() => !qState.isWeekly && qState.answerOK && !socket.socketConnected);

    const pauseQuestion = () => {
      qState.pauseQuestion();
      props.onPause && props.onPause();
      if (socket.socketConnected){
        console.log('emit sync_pause', qState.curPos);
        socket.emitEvent('sync_pause', qState.curPos);
      }
    };

    const displayNextQuestion = () => {
      qState.displayQuestion();
      props.onNext && props.onNext();
      if (socket.socketConnected){
        socket.emitEvent('sync_ready');
      }
    };

    const checkAnswer = () => {
      qState.submitAnswer();
      props.onAnswer && props.onAnswer();
      if (socket.socketConnected){
        socket.emitEvent('sync_answer', props.curAns);
      }
    };

    const getOneWord = () => {
      qState.hintOK = false;
      props.onHint && props.onHint();
    };

    const plusTime = () => {
      qState.plusTimeOK = false;
      props.onPlusTime && props.onPlusTime();
    };

    const plusText = () => {
      qState.plusTextOK = false;
      props.onPlusText && props.onPlusText();
    };

    const giveGood = () => {
      props.onGood && props.onGood(props.curInd);
    };

    const giveBad = () => {
      props.onBad && props.onBad(props.curInd);
    };

    const isMac = navigator.userAgent.toUpperCase().indexOf("MAC") >= 0;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Enter") {
        event.preventDefault();
        if (startOK.value) {
          displayNextQuestion();
        } else if (stopOK.value) {
          pauseQuestion();
        } else if (answerOK.value && !isMac) {
          checkAnswer();
        } else if (
          answerOK.value &&
          isMac &&
          (event.metaKey || event.ctrlKey)
        ) {
          checkAnswer();
        } else if (nextOK.value) {
          displayNextQuestion();
        }
      }
    };

    onMounted(() => {
      window.addEventListener("keydown", handleKeyDown);
    });

    onBeforeUnmount(() => {
      window.removeEventListener("keydown", handleKeyDown);
    });
    return {
      funcsOK,
      answerOK,
      nextOK,
      rateOK,
      stopOK,
      startOK,
      hintOK,
      plusTimeOK,
      plusTextOK,
      userRating,
      pauseQuestion,
      displayNextQuestion,
      checkAnswer,
      getOneWord,
      plusTime,
      plusText,
      giveGood,
      giveBad,
    };
  },
});
</script>

<style scoped>
.icon-stack {
  position: relative;
  display: inline-block;
  width: 1rem;
  height: 1rem;
  line-height: 2rem;
}
.icon-stack-main,
.icon-stack-sub {
  position: absolute;
}
.icon-stack-main {
  left: 50%;
  top: 80%;
  transform: translate(-50%, -50%);
  font-size: 1.5rem;
}
.icon-stack-sub {
  left: 100%;
  top: -10%;
  transform: translate(-50%, -50%);
}
</style>
