import { defineStore } from "pinia";
import axios from "axios";
import { getFirebaseIdToken } from "../services/firebase";

interface Stats {
  qid: number;
  attempt_count: number;
  correct_count: number;
  good_count: number;
  bad_count: number;
}

interface Questions {
  qid: number;
  main_cat: string;
  sub_cat: string;
  q_text: string;
  q_answer: string[];
}

export const useQuestionStore = defineStore("Question", {
  state: () => ({
    questions: [] as Questions[],
    stats: [] as Stats[],
    apiUrl: import.meta.env.VITE_BACKEND_API_URL,
  }),
  actions: {
    async fetchDataFromDatabase(type: string) {
      try {
        const response = await axios.post(
          `${this.apiUrl}/questions-and-stats`,
          {
            mode: type,
          },
          {
            headers: {
              Authorization: await getFirebaseIdToken(),
              "Content-Type": "application/json",
            },
          }
        );
        if (response.data && response.data.questions && response.data.stats) {
          console.log("response exist");
          const questionsArray = Object.values(
            response.data.questions
          ) as Questions[];
          questionsArray.sort((a, b) => a.qid - b.qid);
          this.questions = questionsArray;

          const statsArray = Object.values(response.data.stats) as Stats[];
          statsArray.sort((a, b) => a.qid - b.qid);
          this.stats = statsArray;
        }
      } catch (error) {
        console.error("Error fetching questions:", error);
      }
    },

    getQuestion(index: number) {
      if (index >= 0 && index < this.questions.length) {
        return this.questions[index];
      } else {
        throw new Error("index exceed");
      }
    },

    getStats(index: number) {
      if (index >= 0 && index < this.stats.length) {
        return this.stats[index];
      } else {
        throw new Error("index exceed");
      }
    },

    getDifficulty(index: number) {
      if (index >= 0 && index < this.stats.length) {
        let correct_count = this.stats[index].correct_count;
        let attempt_count = this.stats[index].attempt_count;
        let correct_rate = 0;
        let difficulty = "";
        if (attempt_count !== 0) {
          correct_rate = correct_count / attempt_count;
          if (correct_rate > 0.75) {
            difficulty = "Easy";
          } else if (correct_rate > 0.5) {
            difficulty = "Medium";
          } else if (correct_rate > 0.2) {
            difficulty = "Hard";
          } else {
            difficulty = "Extreme";
          }
        }
        return difficulty;
      } else {
        throw new Error("index exceed");
      }
    },

    getRating(index: number) {
      if (index >= 0 && index < this.stats.length) {
        return (
          this.stats[index].good_count /
          (this.stats[index].good_count + this.stats[index].bad_count)
        );
      } else {
        throw new Error("index exceed");
      }
    },

    getOneWordOfAnswer(index: number) {
      if (index >= 0 && index < this.stats.length) {
        return this.questions[index].q_answer[0][0];
      } else {
        throw new Error("index exceed");
      }
    },

    checkAnswerLength(index: number) {
      let word_length = 0;
      let list = this.questions[index].q_answer;
      if (list[0][0].match(/[\u3400-\u9FBF]/)) {
        word_length = list[0].length;
      } else {
        word_length = -list[0].split(" ").length;
      }
      return word_length;
    },
  },
});
