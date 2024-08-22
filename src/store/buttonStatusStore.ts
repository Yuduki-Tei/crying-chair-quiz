import { defineStore } from "pinia";

export const useButtonStatusStore = defineStore("ButtonStatus", {
  state: () => ({
    isSessionStarted: false,
    isSessionNotStarted: true,
    isAsking: false,
    isCountingDown: false,
    isEnd: true,
  }),
  actions: {
    displayQuestion() {
      // when push the start button
      this.isSessionNotStarted = false;
      this.isAsking = true;
      this.isEnd = false;
      this.isSessionStarted = true;
    },
    pauseQuestion() {
      // when push the pause button
      this.isAsking = false;
      this.isCountingDown = true;
    },
    submitAnswer() {
      // when push the answer button
      this.isCountingDown = false;
    },
    endQeustion() {
      // when the displaying text reaches it's end
      this.isEnd = true;
    },
    endSession() {
      this.isSessionStarted = false;
    },
    reset() {
      this.isSessionStarted = false;
      this.isSessionNotStarted = true;
      this.isAsking = false;
      this.isCountingDown = false;
      this.isEnd = true;
    },
  },
});
