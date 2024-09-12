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
    Cats: {} as { [key: string]: Set<number> },
    questions: [] as Questions[],
  }),
  actions: {
    updateCat(cat: string, newData: Array<number>) {
      if (!this.Cats[cat]) {
        this.Cats[cat] = new Set();
      }

      const currentSet = this.Cats[cat];

      for (let i = newData.length - 1; i >= 0; i--) {
        if (currentSet.has(newData[i])) {
          break;
        }
        currentSet.add(newData[i]);
      }
      console.log("update", this.Cats[cat]);
    },
    getCat(cat: string) {
      if (cat in this.Cats) {
        return this.Cats[cat];
      } else {
        console.error("cat not found");
      }
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
