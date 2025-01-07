<template>
  <div
    class="container px-1 py-1 d-block justify-content-center"
    style="max-width: 450px"
  >
    <Countdown :countdownTime= "countdownTime" :ansLen="ansLen" :state="countdownState" @checkAnswer="checkAnswer" />
    <ResultGrid :act="curInd" />
    <div class="row border m-auto" style="min-width: 280px; min-height: 180px">
      <TextDisplay class="mt-1"
        :fullText="fullText"
        :normalSpeed="normalSpeed"
        :displaySpeed="displaySpeed"
        @countdown="startCountDown"
        @finish="onFinish"
      />
    </div>
    <div class="mt-2 mb-2">
      <div class="form-floating inputbox" :class="{ invisible: !answerOK }">
        <input
          ref="answerInput"
          :disabled="!answerOK"
          class="form-control"
          id="answer"
          placeholder="Your Answer"
          v-model="answer"
          autocomplete="off"
        />
        <label class ="info-text" for="answer">{{ labelText }}</label>
      </div>
    </div>
  </div>
  <QuestionButtons
    :curInd="curInd"
    :curAns="answer"
    :onPause="buttonStop"
    :onNext="startDisplayingText"
    :onAnswer="checkAnswer"
    :onHint="buttonHint"
    :onPlusTime="buttonPlusTime"
    :onPlusText="buttonPlusText"
    :onGood="buttonGood"
    :onBad="buttonBad"
  />
</template>

<script lang="ts">
import { defineComponent, ref, watch, nextTick, computed } from "vue";
import { useRouter } from "vue-router";
import QuestionButtons from "./QuestionButtons.vue";
import ResultGrid from "./ResultGrid.vue";
import Countdown from "./Countdown.vue";
import TextDisplay from "./TextDisplay.vue";
import { useCheckAnswer, buttonBad, buttonGood } from "../composables";
import {
  useQuestionStore,
  useQuestionStateStore,
} from "../store";

export default defineComponent({
  name: "QuestionDisplay",
  components: { QuestionButtons, ResultGrid, Countdown, TextDisplay },
  setup() {
    // the time, and question numbers
    const countdownTime: number = 15; //seconds
    const normalSpeed: number = 120; // miliseconds / chr
    const fastForwardSpeed: number = 30; // miliseconds / chr
    const totalQuestionCount: number = 9; //zero indexed

    // get store data
    const router = useRouter();
    const qState = useQuestionStateStore();
    const qStore = useQuestionStore();

    // props
    const ansLen = ref<number>(0);
    const countdownState = ref<string>("");
    const displaySpeed = ref<number>(0);

    // ref
    const answerOK = computed(() => qState.answerOK);
    const curInd = ref<number>(-1);
    const labelText = ref<string>("");
    const fullText = ref<string>("");
    const answer = ref<string>("");
    const answerInput = ref<HTMLInputElement | null>(null);

    // local var
    var curPos:number = 0;

    qState.reset();

    const _throttle = (func: Function, limit: number = 100) => {
      let inThrottle: boolean;
      return (...args: any[]) => {
        if (!inThrottle) {
          func.apply(this, args);
          inThrottle = true;
          setTimeout(() => (inThrottle = false), limit);
        }
      };
    };

    const startCountDown = (pos: number) => {
      curPos = pos;
      ansLen.value = qStore.checkAnswerLength(curInd.value);
      countdownState.value = "start";
    };

    const buttonHint = () => {
      let firstWord = qStore.getOneWordOfAnswer(curInd.value);
      answer.value = firstWord;
    };

    const buttonPlusTime = () => {
      countdownState.value = "plus";
    };

    const buttonPlusText = _throttle(() => {
      displaySpeed.value = 1;
    });

    const setLabelText = () => {
      const qStore = useQuestionStore();
      ansLen.value = qStore.checkAnswerLength(curInd.value);// get minus number when the first character is not KANJI
      if (ansLen.value > 0) {
        labelText.value = `最佳答案 : 中文${ansLen.value}字`;
      } else {
        labelText.value = `最佳答案 : 非中文${-ansLen.value}詞`;
      }
    };

    const buttonStop = _throttle(() => {
      //when user push the pause button
      setLabelText();
      countdownState.value = "start";
      displaySpeed.value = 0;
    });

    const startDisplayingText = _throttle(() => {
      // start/next button
      curInd.value ++; //current local question index

      if (curInd.value > totalQuestionCount) {
        router.replace("/result");
        return;
      } //to result page when the session ends
      curPos = 0;
      fullText.value = qStore.getQuestion(curInd.value).q_text;
      countdownState.value = "reset";
      answer.value = ""; //init countdown bar and answer value
      displaySpeed.value = normalSpeed;
    });

    const checkAnswer = _throttle(() => {
      countdownState.value = "stop";

      useCheckAnswer(curInd.value, answer.value, curPos); //check if the answer is right and write the result to store
      displaySpeed.value = fastForwardSpeed;
    });

    const onFinish = () =>{
      qState.endQuestion();
    }

    watch(answerOK, async (newValue: boolean) => { //auto focus when input box appears
      if (newValue) {
        await nextTick();
        answerInput.value?.focus();
      }
    });

    return {
      checkAnswer,
      startDisplayingText,
      startCountDown,
      buttonStop,
      buttonHint,
      buttonPlusTime,
      buttonPlusText,
      buttonBad,
      buttonGood,
      onFinish,
      fullText,
      labelText,
      answerInput,
      curInd,
      ansLen,
      answer,
      answerOK,
      countdownState,
      countdownTime,
      normalSpeed,
      displaySpeed,
    };
  },
});
</script>