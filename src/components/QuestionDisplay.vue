<template>
  <div
    class="container px-1 py-1 d-block justify-content-center"
    style="max-width: 450px"
  >
    <CountdownBar :barLength="barLength" />
    <ResultGrid :act="curInd" />
    <div class="row border m-auto" style="min-width: 280px; min-height: 180px">
      <p class="mt-1">{{ displayedText }}</p>
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
        <label for="answer">{{ labelText }}</label>
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
import { defineComponent, ref, watch, nextTick } from "vue";
import { useRouter } from "vue-router";
import QuestionButtons from "./QuestionButtons.vue";
import ResultGrid from "./ResultGrid.vue";
import CountdownBar from "./CountdownBar.vue";
import { useCheckAnswer, buttonBad, buttonGood } from "../composables";
import {
  useResultStore,
  useOnlineQuestionStore,
  useButtonStatusStore,
} from "../store";

export default defineComponent({
  name: "QuestionDisplay",
  components: { QuestionButtons, ResultGrid, CountdownBar },
  setup() {
    // the time, and question numbers
    const countDownTime: number = 15; //seconds
    const displaySpeed: number = 120; // chr / miliseconds
    const fastForwardSpeed: number = 30; // chr / miliseconds
    const totalQuestionCount: number = 9; //zero indexed

    // get store data
    const router = useRouter();
    const res = useResultStore();
    const buttonStatus = useButtonStatusStore();
    buttonStatus.reset();
    const qStore = useOnlineQuestionStore();

    // data for ref
    const curInd = ref<number>(-1); //zero indexed
    const displayedText = ref<string>("");
    const barLength = ref<number>(100);
    const answerOK = ref<boolean>(false);
    const answer = ref<string>("");
    const labelText = ref<string>("先按鈴 再回答!");
    const answerInput = ref<HTMLInputElement | null>(null);

    //local var
    var countDownInterval: any = 0;
    var questionInterval: any = 0;
    var isCountingDown: boolean = false;
    var adjustedCountDownTime: number = 0;

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

    const _displayTextByCharacter = (
      t: string,
      index: number,
      text: string,
      speed: number
    ) => {
      let char = index; //character index
      let curText = t; //displayed full text
      answerOK.value = false; //not allow to answer when text displaying
      questionInterval = setInterval(() => {
        if (char < text.length) {
          curText += text[char];
          displayedText.value = curText;
          char++;
        } else {
          clearInterval(questionInterval);
          if (speed === displaySpeed) {
            //this is a normal display
            _startCountDown();
          } else {
            //this is a fastforward display
            buttonStatus.endQuestion();
          }
        }
      }, speed);
    };

    const _changeLabelText = () => {
      let len = qStore.checkAnswerLength(curInd.value);
      if (len > 0) {
        labelText.value = `最佳答案 : 中文${len}字`;
      } else {
        labelText.value = `最佳答案 : 非中文${-len}詞`;
      }
    };

    const _getAdjustTime = () => {
      let len = qStore.checkAnswerLength(curInd.value);
      let adjustedCountDownTime = countDownTime;

      if (len >= 4) {
        adjustedCountDownTime = countDownTime * 1.4;
      } else if (len <= 2 && len > 0) {
        adjustedCountDownTime = countDownTime * 0.8;
      } else if (len < 0 && Math.abs(len) >= 2) {
        adjustedCountDownTime = countDownTime * 1.4;
      }
      return adjustedCountDownTime;
    };

    const _startCountDown = () => {
      if (isCountingDown) return;
      isCountingDown = true;
      adjustedCountDownTime = _getAdjustTime();

      var start = new Date().getTime();

      countDownInterval = setInterval(function () {
        let curTime = new Date().getTime() - start;
        barLength.value = Math.floor(
          Math.max((1 - curTime / (adjustedCountDownTime * 1000)) * 100, 0)
        );
        if (curTime > adjustedCountDownTime * 1010) {
          // 1.01x tolerance
          clearInterval(countDownInterval);
          isCountingDown = false;
          checkAnswer();
        }
      }, countDownTime * 5); //the refresh rate of cout down times/ miliseconds, can be any.
    };

    const _stopDisplayingText = () => {
      res.setRes(curInd.value, { interval: displayedText.value.length }); //store the stop point
      clearInterval(questionInterval); //stop the question
    };

    const buttonHint = _throttle(() => {
      let firstWord = qStore.getOneWordOfAnswer(curInd.value);
      answer.value = firstWord;
    });

    const buttonPlusTime = _throttle(() => {
      adjustedCountDownTime += countDownTime * 2;
    });

    const buttonPlusText = _throttle(() => {
      let curLen = displayedText.value.length;
      let qt = qStore.getQuestion(curInd.value).q_text;
      let allLen = qt.length;
      let p = Math.max(Math.ceil(allLen / 10), 5);
      displayedText.value = qt.slice(0, Math.min(curLen + p, allLen));
    });

    const buttonStop = _throttle(() => {
      //when user push the pause button
      answerOK.value = true; // allow to answer
      _changeLabelText();
      _stopDisplayingText();
      _startCountDown();
    });

    const startDisplayingText = _throttle(() => {
      // start/next button
      displayedText.value = "";
      curInd.value++; //current local question index

      if (curInd.value > totalQuestionCount) {
        router.replace("/result");
        return;
      } //to result page when the session ends

      barLength.value = 100;
      answer.value = ""; //init countdown bar and answer value
      _displayTextByCharacter(
        "",
        0,
        qStore.getQuestion(curInd.value).q_text,
        displaySpeed
      ); //start display text from index 0 with normal displayspeed
    });

    const checkAnswer = _throttle(() => {
      buttonStatus.submitAnswer();
      if (res.getRes(curInd.value).interval === 0) {
        res.setRes(curInd.value, { interval: displayedText.value.length });
      }
      clearInterval(countDownInterval);
      isCountingDown = false;

      useCheckAnswer(curInd.value, answer.value); //check if the answer is right and write the result to store
      _displayTextByCharacter(
        displayedText.value,
        displayedText.value.length,
        qStore.getQuestion(curInd.value).q_text,
        fastForwardSpeed
      ); //quickly show the text remained
    });

    watch(answerOK, async (newValue) => {
      if (newValue) {
        await nextTick();
        answerInput.value?.focus();
      }
    });

    return {
      checkAnswer,
      startDisplayingText,
      buttonStop,
      buttonHint,
      buttonPlusTime,
      buttonPlusText,
      buttonBad,
      buttonGood,
      labelText,
      answerInput,
      curInd,
      answer,
      answerOK,
      barLength,
      displayedText,
    };
  },
});
</script>
