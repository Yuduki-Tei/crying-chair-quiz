import { defineStore } from "pinia";
import { fromBase64, toBase64 } from "../composables";

interface Questions {
  qid: number;
  main_cat: string;
  sub_cat: string;
  q_text: string;
  q_answer: string[];
  encoded?: boolean;
}

export const useLocalQuestionStore = defineStore("LocalQuestion", {
  state: () => ({
    Cats: {} as { [key: string]: number[] },
    questions: [] as Questions[],
  }),
  actions: {
    updateCat(cat: string, newData: number[]) {
      if (!this.Cats[cat] || !Array.isArray(this.Cats[cat])) {
        this.Cats[cat] = [];
      }

      for (let i = newData.length - 1; i >= 0; i--) {
        if (this.Cats[cat].includes(newData[i])) {
          break;
        }
        this.Cats[cat].push(newData[i]);
      }
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

      const encodedQuestion = {
        ...question,
        q_text: toBase64(new TextEncoder().encode(question.q_text)),
        q_answer: question.q_answer.map((answer) =>
          toBase64(new TextEncoder().encode(answer))
        ),
        encoded: true,
      };

      this.questions.push(encodedQuestion);
    },

    getQuestion(qid: number) {
      const question = this.questions.find((q) => q.qid === qid);
      if (!question) return null;

      if (!question.encoded) {
        const decodedQuestion = {
          ...question,
          q_text: question.q_text,
          q_answer: question.q_answer,
          encoded: true,
        };

        this.updateQuestion(decodedQuestion);

        return decodedQuestion;
      }

      const decodedQuestion = {
        ...question,
        q_text: new TextDecoder().decode(fromBase64(question.q_text)),
        q_answer: question.q_answer.map((answer) =>
          new TextDecoder().decode(fromBase64(answer))
        ),
      };

      return decodedQuestion;
    },
  },
  persist: true,
});
