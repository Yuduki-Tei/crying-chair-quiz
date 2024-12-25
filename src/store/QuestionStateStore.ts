import { defineStore } from "pinia";
import { useQuestionStore } from "./QuestionStore";

export const useQuestionStateStore = defineStore("QuestionState", {
  state: () => ({
    isWeekly: true,
    answerOK: false,
    nextOK: false,
    startOK: true,
    stopOK: false,
    hintOK: false,
    plusTimeOK: false,
    plusTextOK: false,
    rateOK: false,
    curInd: -1,
    labelText: "先按鈴 再回答!",
    adjustedTime: 0,
  }),
  actions: {
    setType(type: string) {
      this.isWeekly = type === "weekly";
    },
    displayQuestion() {
      // when push the start button
      this.stopOK = true;

      this.answerOK = false;
      this.nextOK = false;
      this.rateOK = false;
      this.startOK = false;
    },
    pauseQuestion() {
      // when push the pause button
      this.answerOK = true;

      this.nextOK = false;
      this.rateOK = false;
      this.startOK = false;
      this.stopOK = false;
    },
    disableAll() {
      // when push the answer button
      this.answerOK = false;
      this.nextOK = false;
      this.rateOK = false;
      this.startOK = false;
      this.stopOK = false;
    },
    submitAnswer() {
      this.disableAll();
    },
    endSession() {
      this.disableAll();
    },
    endQuestion() {
      // when the displaying text reaches it's end
      this.nextOK = true;
      this.rateOK = true;

      this.answerOK = false;
      this.startOK = false;
      this.stopOK = false;
    },

    plusCurInd() {
      this.curInd += 1;
    },

    setLabelText() {
      const qStore = useQuestionStore();
      let len = qStore.checkAnswerLength(this.curInd);// get minus number when the first character is not KANJI
      if (len > 0) {
        this.labelText = `最佳答案 : 中文${len}字`;
      } else {
        this.labelText = `最佳答案 : 非中文${-len}詞`;
      }
    },

    calculateAdjustTime(countDownTime: number) {
      const qStore = useQuestionStore();
      let len = qStore.checkAnswerLength(this.curInd);
      this.adjustedTime = countDownTime;

      if (len >= 4) {
        this.adjustedTime = countDownTime * 1.4;
      } else if (len <= 2 && len > 0) {
        this.adjustedTime = countDownTime * 0.8;
      } else if (len < 0 && Math.abs(len) >= 2) {
        this.adjustedTime = countDownTime * 1.4;
      }
    },

    plusAdjustedTime(countDownTime: number) {
      this.adjustedTime += countDownTime * 2;
    },

    reset() {
      this.startOK = true;

      this.answerOK = false;
      this.nextOK = false;
      this.rateOK = false;
      this.stopOK = false;

      this.hintOK = !this.isWeekly;
      this.plusTimeOK = !this.isWeekly;
      this.plusTextOK = !this.isWeekly;

      this.curInd = -1; //zero indexed
      this.labelText = "先按鈴 再回答!";
      this.adjustedTime = 0;
    },
  },
});
