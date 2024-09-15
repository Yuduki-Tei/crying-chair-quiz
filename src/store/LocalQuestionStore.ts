import { defineStore } from "pinia";

interface Questions {
  qid: number;
  main_cat: string;
  sub_cat: string;
  q_text: string;
  q_answer: string[];
}

export const useLocalQuestionStore = defineStore("LocalQuestion", {
  state: () => ({
    Cats: {} as { [key: string]: number[] },
    questions: [] as Questions[],
  }),
  actions: {
    updateCat(cat: string, newData: number[]) {
      if (!this.Cats[cat]) {
        this.Cats[cat] = [];
      }

      const currentArray = this.Cats[cat];

      for (let i = newData.length - 1; i >= 0; i--) {
        if (currentArray.includes(newData[i])) {
          break;
        }
        currentArray.push(newData[i]);
      }
      console.log("update", this.Cats[cat]);
    },

    getCat(cat: string) {
      return this.Cats[cat] || null;
    },

    updateQuestion(question: Questions) {
      const existingIndex = this.questions.findIndex(
        (q) => q.qid === question.qid
      );

      if (existingIndex !== -1) {
        this.questions.splice(existingIndex, 1);
      }
      this.questions.push(question);
    },

    getQuestion(qid: number) {
      return this.questions.find((q) => q.qid === qid) || null;
    },
  },
  persist: true,
});
