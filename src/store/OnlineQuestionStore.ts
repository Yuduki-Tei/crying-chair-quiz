import { defineStore } from "pinia";
import { useLocalQuestionStore } from "./";
import {
  getFirestore,
  collection,
  query,
  orderBy,
  limit,
  getDocs,
  doc,
  getDoc,
  QueryDocumentSnapshot,
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

export const useOnlineQuestionStore = defineStore("OnlineQuestion", {
  state: () => ({
    questions: [] as Questions[],
    stats: [] as Stats[],
  }),
  actions: {
    async _getMaxQid() {
      const db = getFirestore();
      const mq = query(
        //get the document with maximum id from database
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

    async _fetchQuestionsByQids(qids: Set<number>) {
      const localStore = useLocalQuestionStore();

      const localQuestions: Questions[] = [];
      const qidsToFetch: Set<number> = new Set();

      qids.forEach((qid) => {
        const localQuestion = localStore.getQuestion(qid); //check local store
        if (localQuestion) {
          localQuestions.push(localQuestion);
        } else {
          qidsToFetch.add(qid);
        }
      });

      let fetchedQuestions: Questions[] = [];
      if (qidsToFetch.size > 0) {
        const db = getFirestore();
        const questionsCollection = collection(db, "Questions");

        const questionPromises = [...qidsToFetch].map((qid) =>
          getDoc(doc(questionsCollection, qid.toString()))
        );

        const questionSnapshots = await Promise.all(questionPromises);

        fetchedQuestions = questionSnapshots
          .filter((snap) => snap.exists())
          .map((snap) => snap.data() as Questions);

        fetchedQuestions.forEach((question) => {
          localStore.updateQuestion(question);
        });
      }

      return [...localQuestions, ...fetchedQuestions];
    },

    async fetchCategoryQids(type: string): Promise<number[]> {
      const db = getFirestore();
      const localStore = useLocalQuestionStore();

      const lastCatUpdate = localStorage.getItem(`${type}LastCatUpdate`);
      const now = new Date();
      const lastSunday = new Date(now);
      const dayOfWeek = now.getDay();
      lastSunday.setDate(now.getDate() - dayOfWeek);
      lastSunday.setHours(23, 0, 0, 0);

      if (!lastCatUpdate || new Date(lastCatUpdate) < lastSunday){ 
        // old local store version or last update before weekly upload, update local store
        localStorage.setItem(`${type}LastCatUpdate`, new Date().toISOString());
        const docRef = doc(db, "Category", type);
        const docSnapshot = await getDoc(docRef);

        if (docSnapshot.exists()) {
          const qidArray = docSnapshot.data().qids;
          localStore.updateCat(type, qidArray);
        } else {
          console.error(`No online qids found for category: ${type}`);
          return [];
        }
      };

      if (localStore.Cats[type] && localStore.Cats[type].length > 0) {
        // get data from local store
        return localStore.Cats[type];
      }
      else{
        console.error('No available local data');
        return [];
      };
    },

    async fetchDataFromDatabase(type: string) {
      const db = getFirestore();
      let querySnapshot: any;
      let qids = new Set<number>();

      if (type === "weekly") {
        // Fetch 10 questions with largest qids
        const q = query(
          collection(db, "Questions"),
          orderBy("qid", "desc"),
          limit(10)
        );
        querySnapshot = await getDocs(q);

        // Process the results
        const fetchedQuestions = querySnapshot.docs.map(
          (doc: QueryDocumentSnapshot) => doc.data() as Questions
        );
        this.questions = fetchedQuestions;
      } else {
        const maxQid = (await this._getMaxQid()) - 10; // all questions except weekly

        if (type === "random") {
          qids = this._getRandomQids(maxQid, 10);
        } else {
          const qidSet = new Set(await this.fetchCategoryQids(type));
          qids = this._getRandomQids(maxQid, 10, qidSet);
        }

        // We have correct qids now
        const combinedQuestions = await this._fetchQuestionsByQids(qids);
        this.questions = combinedQuestions;
      }

      this.stats = await this._fetchStatsForQids(Array.from(qids));
    },

    async _fetchStatsForQids(qids: number[]): Promise<Stats[]> {
      const db = getFirestore();
      const statsCollection = collection(db, "Stats");

      const statsPromises = qids.map((qid) =>
        getDoc(doc(statsCollection, qid.toString()))
      );

      const statsSnapshots = await Promise.all(statsPromises);

      return statsSnapshots
        .filter((snap) => snap.exists())
        .map((snap) => snap.data() as Stats);
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
