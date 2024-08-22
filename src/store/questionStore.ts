import { defineStore } from "pinia";
import {
  getFirestore,
  collection,
  query,
  orderBy,
  limit,
  getDocs,
  where,
  doc,
  getDoc,
} from "firebase/firestore";

interface Stats {
  qid: number;
  attempt_count: number;
  correct_count: number;
  rating: number;
  rated_player_count: number;
}

interface Questions {
  qid: number;
  main_cat: string;
  sub_cat: string;
  q_text: string;
  q_answer: string[];
}

export const useQuestionStore = defineStore("question", {
  state: () => ({
    questions: [] as Questions[],
    stats: [] as Stats[],
  }),
  actions: {
    async fetchDataFromDatabase(type: string) {
      const db = getFirestore();
      const questions: Questions[] = [];
      const stats: Stats[] = [];

      let querySnapshot: any;

      if (type === "weekly") {
        // Fetch 10 questions with largest qids
        const q = query(
          collection(db, "Questions"),
          orderBy("qid", "desc"),
          limit(10)
        );
        querySnapshot = await getDocs(q);
      } else {
        const maxQid = (await this.getMaxQid()) - 10;
        var qids = new Set<number>();

        if (type === "random") {
          // Fetch 10 random questions from qid below maxQid-10
          while (qids.size < 10) {
            const randomQid = Math.floor(Math.random() * maxQid) + 1; // 1 indexed
            if (!qids.has(randomQid)) {
              qids.add(randomQid);
            }
          }
        } else {
          // Fetch 10 random questions from certain category
          const docRef = doc(db, "Category", type);
          const docSnapshot = await getDoc(docRef);
          if (docSnapshot.exists()) {
            let all_qids = docSnapshot.data().qids;
            while (qids.size < 10) {
              const randomQid = Math.floor(Math.random() * all_qids.length);
              if (
                !qids.has(all_qids[randomQid]) &&
                all_qids[randomQid] <= maxQid
              ) {
                qids.add(all_qids[randomQid]);
              }
            }
          } else {
            console.error(`No qids found for category: ${type}`);
            return;
          }
        }
        const q = query(
          collection(db, "Questions"),
          where("qid", "in", [...qids])
        );
        querySnapshot = await getDocs(q);
      }
      // Fetch questions and their stats
      for (const docSnapshot of querySnapshot.docs) {
        const questionData = docSnapshot.data() as Questions;
        questions.push(questionData);

        const statsDocRef = doc(db, `Stats/${docSnapshot.id}`);
        const statsSnapshot = await getDoc(statsDocRef);

        const statsData = statsSnapshot.data() as Stats;
        stats.push(statsData);
      }
      this.questions = questions;
      this.stats = stats;
    },

    async getMaxQid() {
      const db = getFirestore();
      const mq = query(
        collection(db, "Questions"),
        orderBy("qid", "desc"),
        limit(1)
      );
      let maxQid = 0;
      const maxSnapshot = await getDocs(mq);
      maxSnapshot.forEach((doc: any) => {
        maxQid = doc.data().qid;
      });
      return maxQid;
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
        return this.stats[index].rating;
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
