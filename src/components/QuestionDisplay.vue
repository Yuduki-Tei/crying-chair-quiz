<template>
  <div
    class="container px-1 py-1 d-block justify-content-center"
    style="max-width: 450px"
  >
    <Countdown :countdownTime= "countdownTime" :ansLen="ansLen" :state="countdownState" @checkAnswer="checkAnswer" />
    <ResultGrid :act="curInd" />
    <div class="row border m-auto" style="min-width: 280px; min-height: 180px">
      <TextDisplay class="mt-1"
        ref="textDisplayRef"
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
    @pause="buttonStop"
    @next="buttonNext"
    @answer="checkAnswer"
    @hint="buttonHint"
    @plus_time="buttonPlusTime"
    @plus_text="buttonPlusText"
    @good="buttonGood(curInd)"
    @bad="buttonBad(curInd)"
  />
  <Battle
  v-if = "isBattle"
  ref = "battleRef"
  :curPos="curPos"
  :answer="answer"
  @battle_pause="onBattlePause"
  @battle_answer="onBattleAnswer"
  @battle_start="displayText"/>
</template>

<script lang="ts">
import { defineComponent, ref, watch, nextTick, computed } from "vue";
import { useRouter } from "vue-router";
import QuestionButtons from "./QuestionButtons.vue";
import ResultGrid from "./ResultGrid.vue";
import Countdown from "./Countdown.vue";
import TextDisplay from "./TextDisplay.vue";
import Battle from "./Battle.vue";
import { useCheckAnswer, checkOpponentAnswer, buttonBad, buttonGood} from "../composables";
import {
  useQuestionStore,
  useQuestionStateStore,
} from "../store";

export default defineComponent({
  name: "QuestionDisplay",
  components: { QuestionButtons, ResultGrid, Countdown, TextDisplay, Battle },
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
    const isBattle = qState.isBattle

    // ref
    const answerOK = computed(() => qState.answerOK);
    const curInd = ref<number>(-1);
    const labelText = ref<string>("");
    const fullText = ref<string>("");
    const answer = ref<string>("");
    const answerInput = ref<HTMLInputElement | null>(null);
    const textDisplayRef = ref<{ getCurPos: () => number } | null>(null);
    const battleRef = ref<{ battlePause: (curPos: number) => void; battleAnswer: (answer: string) => void; battleStart: () => void } | null>(null);

    // local var
    let curPos:number = 0;

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

    const startCountDown = (localStop: false) => {
      if(!localStop){
        return
      }
      curPos = textDisplayRef.value?.getCurPos() || 0;
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

    const buttonPlusText = () => {
      displaySpeed.value = 1;
    };

    const setLabelText = () => {
      ansLen.value = qStore.checkAnswerLength(curInd.value); // Answer length is negative if the first character is not a Chinese character
      if (ansLen.value > 0) {
        labelText.value = `最佳答案 : 中文${ansLen.value}字`;
      } else {
        labelText.value = `最佳答案 : 非中文${-ansLen.value}詞`;
      }
    };

    const buttonStop = () => {
      //when user push the pause button
      curPos = textDisplayRef.value?.getCurPos() || 0;
      battleRef.value?.battlePause(curPos);
      setLabelText();
      countdownState.value = "start";
      displaySpeed.value = 0;
    };

    const buttonNext = _throttle(() => {
      if(!isBattle){
        displayText()
      }
      else{
        battleRef.value?.battleStart();
      }
    });

    const displayText = _throttle(() => {
      // start/next button
      qState.displayQuestion();
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
      battleRef.value?.battleAnswer(answer.value);
      qState.submitAnswer();
      countdownState.value = "stop";
      displaySpeed.value = fastForwardSpeed;
      useCheckAnswer(curInd.value, answer.value, curPos); //check if the answer is right and write the result to store
    });

    const onFinish = () =>{
      qState.endQuestion();
    };

    const onBattlePause = (pos: number) => {
      console.log(`position = ${pos}`)
      displaySpeed.value = 0;
    };

    const onBattleAnswer = (ans: string) => {
      const isCorrect = checkOpponentAnswer(curInd.value, ans);
      if (isCorrect){
        qState.submitAnswer();
        displaySpeed.value = fastForwardSpeed;
      }
      else{
        qState.displayQuestion();
        displaySpeed.value = normalSpeed;
      }
    };

    watch(answerOK, async (newValue: boolean) => { //auto focus when input box appears
      if (newValue) {
        await nextTick();
        answerInput.value?.focus();
      }
    });

    return {
      battleRef,
      textDisplayRef,
      checkAnswer,
      buttonNext,
      displayText,
      startCountDown,
      buttonStop,
      buttonHint,
      buttonPlusTime,
      buttonPlusText,
      buttonBad,
      buttonGood,
      onBattlePause,
      onBattleAnswer,
      onFinish,
      fullText,
      labelText,
      answerInput,
      curInd,
      curPos,
      ansLen,
      answer,
      answerOK,
      countdownState,
      countdownTime,
      normalSpeed,
      displaySpeed,
      isBattle,
    };
  },
});
</script>