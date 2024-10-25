import { defineStore } from "pinia";
import { useCatStore } from "./"
import {
  getFirestore,
  collection,
  query,
  orderBy,
  limit,
  getDocs,
  where,
} from "firebase/firestore";

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
  }),
  actions: {
    async _getMaxQid() {
      const lastmaxQidUpdate = localStorage.getItem("maxQidLastUpdate") || "";
      let maxQid = 0;
      if (!lastmaxQidUpdate || lastmaxQidUpdate < this._getLastSunday()) {
        const db = getFirestore();
        const mq = query(
          //get the document with maximum id from database
          collection(db, "Questions"),
          orderBy("qid", "desc"),
          limit(1)
        );
        const maxSnapshot = await getDocs(mq);
        maxSnapshot.forEach((doc: any) => {
          maxQid = doc.data().qid;
          localStorage.setItem("maxQidLastUpdate", new Date().toISOString());
          localStorage.setItem("maxQid", maxQid.toString());
        });
      }
      maxQid = parseInt(localStorage.getItem("maxQid") || "0");
      return maxQid;
    },

    _getRandomQids(
      maxQid: number,
      count: number,
      from: Set<number> = new Set()
    ): Set<number> {
      const qids: Set<number> = new Set<number>();
      while (qids.size < count) {
        //generate random qids until count
        const randomQid = Math.floor(Math.random() * maxQid) + 1; // 1 indexed
        if (from.size > 0 && !from.has(randomQid)) {
          continue;
        }
        qids.add(randomQid);
      }
      return qids;
    },

    _getLastSunday() {
      const now = new Date();
      const dayOfWeek = now.getUTCDay();
      const lastSunday = new Date(now);

      lastSunday.setUTCDate(now.getUTCDate() - dayOfWeek);
      lastSunday.setUTCHours(14, 0, 0, 0);

      return lastSunday.toISOString();
    },

    async fetchCategoryQids(type: string): Promise<number[]> {

      const catLastUpdate = localStorage.getItem("catLastUpdate");
      const cStore = useCatStore()

      if (!catLastUpdate || catLastUpdate < this._getLastSunday()){
        await cStore.updateCat();
        localStorage.setItem("catLastUpdate", new Date().toISOString())
      }

      let cat = cStore.getCat(type);

      if (cat && cat.length > 0) {
        // get data from local store
        return cat;
      } else {
        console.error("No available local data");
        return [];
      }
    },

    async fetchDataFromDatabase(type: string) {
      const db = getFirestore();
      var maxQid = await this._getMaxQid();
      let qids = new Array<number>();

      if (type === "weekly") {
        // Fetch 10 questions with largest qids
        qids = Array.from({ length: 10 }, (_, i) => maxQid - i);
      } else {
        maxQid -= 10; // all questions except weekly
        if (type === "random") {
          qids = Array.from(this._getRandomQids(maxQid, 10));
        } else {
          const qidSet = new Set(await this.fetchCategoryQids(type));
          qids = Array.from(this._getRandomQids(maxQid, 10, qidSet));
        }
      }
      // We have correct qids now
      const q = query(
        collection(db, "Questions"),
        where("qid", "in", qids)
      );
      const querySnapshot = await getDocs(q);
      const fetchedQuestions = querySnapshot.docs.map((doc) => doc.data() as Questions);
      fetchedQuestions.sort((a, b) => {return a['qid'] -b['qid'];});
      this.questions = fetchedQuestions;
      this.stats = await this._fetchStatsForQids(Array.from(qids));
    },

    async _fetchStatsForQids(qids: number[]): Promise<Stats[]> {
      const db = getFirestore();

      const q = query(
        collection(db, "Stats"),
        where("qid", "in", qids)
      );
      const querySnapshot = await getDocs(q);
      const statsSnapshots = querySnapshot.docs.map((doc) => doc.data() as Stats);

      return statsSnapshots
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
