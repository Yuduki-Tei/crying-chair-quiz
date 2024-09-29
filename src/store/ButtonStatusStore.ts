import { defineStore } from "pinia";

export const useButtonStatusStore = defineStore("ButtonStatus", {
  state: () => ({
    isWeekly: true,
    answerOK: false,
    nextOK: false,
    startOK: true,
    stopOK: false,
    hintOK: false,
    plusTimeOK: false,
    plusTextOK: false,
  }),
  actions: {
    setType(type: string){
      this.isWeekly = type === "weekly";
    },
    displayQuestion() {
      // when push the start button
      this.stopOK = true;

      this.answerOK = false;
      this.nextOK = false;
      this.startOK = false;
    },
    pauseQuestion() {
      // when push the pause button
      this.answerOK = true;

      this.nextOK = false;
      this.startOK = false;
      this.stopOK = false;
    },
    disableAll() {
      // when push the answer button
      this.answerOK = false;
      this.nextOK = false;
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

      this.answerOK = false;
      this.startOK = false;
      this.stopOK = false;
    },

    reset() {
      this.startOK = true;

      this.answerOK = false;
      this.nextOK = false;
      this.stopOK = false;

      this.hintOK = (!this.isWeekly);
      this.plusTimeOK = (!this.isWeekly);
      this.plusTextOK = (!this.isWeekly);
    },
  },
});
