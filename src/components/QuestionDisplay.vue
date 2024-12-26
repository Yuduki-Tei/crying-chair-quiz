<template>
  <div
    class="container px-1 py-1 d-block justify-content-center"
    style="max-width: 450px"
  >
    <CountdownBar :barLength="barLength" />
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
import CountdownBar from "./CountdownBar.vue";
import TextDisplay from "./TextDisplay.vue";
import { useCheckAnswer, buttonBad, buttonGood } from "../composables";
import {
  useResultStore,
  useQuestionStore,
  useQuestionStateStore,
} from "../store";

export default defineComponent({
  name: "QuestionDisplay",
  components: { QuestionButtons, ResultGrid, CountdownBar, TextDisplay },
  setup() {
    // the time, and question numbers
    const countDownTime: number = 15; //seconds
    const normalSpeed: number = 120; // miliseconds / chr
    const fastForwardSpeed: number = 30; // miliseconds / chr
    const totalQuestionCount: number = 9; //zero indexed

    // get store data
    const router = useRouter();
    const res = useResultStore();
    const questionState = useQuestionStateStore();
    const qStore = useQuestionStore();

    // data for ref
    const answerOK = computed(() => questionState.answerOK);
    const curInd = computed(() => questionState.curInd);
    const labelText = computed(() => questionState.labelText);

    const fullText = ref<string>("");
    const displaySpeed = ref<number>(0); // pass to TextDisplay, 0:stop, 1:use textPlus(), else just uset the speed to display
    const answer = ref<string>("");
    const answerInput = ref<HTMLInputElement | null>(null);
    const barLength = ref<number>(100);

    //local var
    const adjustedCountDownTime = computed(() => questionState.adjustedTime);
    var countDownId: number = 0;
    var isCountingDown: boolean = false;
    var curPos: number = 0; // log current position when pause

    questionState.reset();

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
      if (isCountingDown) return;
      isCountingDown = true;
      questionState.calculateAdjustTime(countDownTime);
      const start = new Date().getTime();
      res.setRes(curInd.value, { interval: pos });
      curPos = pos;

      const _tick = () => {
        if (!isCountingDown){
          cancelAnimationFrame(countDownId)
          return; //isCountingDown == false means the countdown has been canceled
        }

        const curTime = new Date().getTime() - start;
        barLength.value = Math.floor(
          Math.max((1 - curTime / (adjustedCountDownTime.value * 1000)) * 100, 0)
        );

        if (curTime > adjustedCountDownTime.value  * 1010) {// timeout
          // 1.01x tolerance
          cancelAnimationFrame(countDownId)
          isCountingDown = false;
          checkAnswer();
        } else {
          countDownId = requestAnimationFrame(_tick); // recursive functioncall
        }
      };
      countDownId = requestAnimationFrame(_tick); // trigger
    };

    const buttonHint = _throttle(() => {
      let firstWord = qStore.getOneWordOfAnswer(curInd.value);
      answer.value = firstWord;
    });

    const buttonPlusTime = _throttle(() => {
      questionState.plusAdjustedTime(countDownTime);
    });

    const buttonPlusText = _throttle(() => {
      displaySpeed.value = 1;
    });

    const buttonStop = _throttle(() => {
      //when user push the pause button
      questionState.setLabelText();
      displaySpeed.value = 0;
    });

    const startDisplayingText = _throttle(() => {
      // start/next button
      questionState.plusCurInd(); //current local question index

      if (curInd.value > totalQuestionCount) {
        router.replace("/result");
        return;
      } //to result page when the session ends
      curPos = 0;
      fullText.value = qStore.getQuestion(curInd.value).q_text;
      barLength.value = 100;
      answer.value = ""; //init countdown bar and answer value
      displaySpeed.value = normalSpeed;
    });

    const checkAnswer = _throttle(() => {
      if (res.getRes(curInd.value).interval === 0) {
        res.setRes(curInd.value, { interval: fullText.value.length });
      }
      cancelAnimationFrame(countDownId);
      isCountingDown = false; //cancel countdown

      useCheckAnswer(curInd.value, answer.value); //check if the answer is right and write the result to store
      displaySpeed.value = fastForwardSpeed;
    });

    const onFinish = () =>{
      questionState.endQuestion();
    }

    watch(answerOK, async (newValue) => { //auto focus when input box appears
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
      answer,
      answerOK,
      barLength,
      normalSpeed,
      displaySpeed,
    };
  },
});
</script>