import { defineStore } from "pinia";
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  increment,
  updateDoc,
  writeBatch,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getBit, fromBase64, compareBitArrays, getQid } from "../composables";

interface userData {
  uid: string;
  user_name: string;
  user_mail: string;
  answer_history: string;
  correct_history: string;
  bad_history: string;
  good_history: string;
  last_active_time: string;
}

export const useUserStore = defineStore("User", {
  state: () => ({
    snapShot: {} as userData,
    dataList: {} as userData,
  }),
  actions: {
    resetStore() {
      this.$reset();
    },

    getUserRate(qInd: number) {
      if (qInd >= 10 || qInd < 0) return "";
      const qid = getQid(qInd);
      const bad_history = fromBase64(this.dataList.bad_history);
      const good_history = fromBase64(this.dataList.good_history);
      const bad_bit = getBit(bad_history, qid);
      const good_bit = getBit(good_history, qid);
      var rate = "";
      if (good_bit === 1) {
        rate = "good";
      } else if (bad_bit === 1) {
        rate = "bad";
      }
      return rate;
    },

    async _getDatabaseSnapshot() {
      const db = getFirestore();
      const userDocRef = doc(db, "users", this.dataList.uid);
      const userDoc = await getDoc(userDocRef);
      if (!userDoc.exists()) {
        console.error("no user data found");
        return;
      }
      const data = userDoc.data();
      this.snapShot = {
        uid: data.uid,
        user_name: data.user_name || "",
        user_mail: data.user_mail || "",
        answer_history: data.answer_history || "",
        correct_history: data.correct_history || "",
        bad_history: data.bad_history || "",
        good_history: data.good_history || "",
        last_active_time: data.last_active_time || "",
      };
    },

    async checkUserAccount() {
      const user = getAuth().currentUser;
      if (!user) {
        console.error("no user found");
        return;
      }
      const db = getFirestore();
      const userDocRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userDocRef);
      if (!userDoc.exists()) {
        await setDoc(userDocRef, {
          uid: user.uid || "",
          user_name: user.displayName || "",
          user_mail: user.email || "",
          answer_history: "",
          correct_history: "",
          bad_history: "",
          good_history: "",
          last_active_time: "",
        });
      } else {
        const data = userDoc.data();
        this.dataList = {
          uid: data.uid,
          user_name: data.user_name || "",
          user_mail: data.user_mail || "",
          answer_history: data.answer_history || "",
          correct_history: data.correct_history || "",
          bad_history: data.bad_history || "",
          good_history: data.good_history || "",
          last_active_time: data.last_active_time || "",
        };
        this.snapShot = this.dataList;
      }
    },

    async updateUserName(name: string) {
      const db = getFirestore();
      const user = getAuth().currentUser;
      if (!user) {
        console.error("no user found");
        return;
      }
      const userDocRef = doc(db, "users", user.uid);
      const updates = {
        user_name: name,
      };
      await updateDoc(userDocRef, updates);
    },

    async updateResToDatabase() {
      await this._getDatabaseSnapshot();

      if (
        this.snapShot.last_active_time &&
        this.dataList.last_active_time &&
        this.snapShot.last_active_time.trim() !=
          this.dataList.last_active_time.trim()
      ) {
        console.error("data version mismatch, roll back to online data");
        this.dataList = this.snapShot;
        return;
      }

      let ans_diff =
        this.dataList.answer_history !== this.snapShot.answer_history;
      let rate_diff =
        this.dataList.bad_history !== this.snapShot.bad_history ||
        this.dataList.good_history !== this.snapShot.good_history;
      if (!ans_diff && !rate_diff) {
        return;
      } else {
        const db = getFirestore();
        const userDocRef = doc(db, "users", this.dataList.uid);

        const updatedData = {
          answer_history: this.dataList.answer_history,
          correct_history: this.dataList.correct_history,
          bad_history: this.dataList.bad_history,
          good_history: this.dataList.good_history,
          last_active_time: new Date().toLocaleString("sv-SE"),
        };

        await updateDoc(userDocRef, updatedData);
      }
    },
    async updateStatsToDatabase() {
      const db = getFirestore();
      let inds = compareBitArrays(
        fromBase64(this.snapShot.answer_history),
        fromBase64(this.dataList.answer_history)
      );

      for (let index of inds) {
        let updates = {};
        let bit = fromBase64(this.dataList.correct_history);
        if (getBit(bit, index) === 1) {
          updates = {
            attempt_count: increment(1),
            correct_count: increment(1),
          };
        } else {
          updates = {
            attempt_count: increment(1),
          };
        }

        const docRef = doc(db, "Stats", index.toString());
        await updateDoc(docRef, updates);
      }
    },

    _ratingBatchGenerate(
      batch: any,
      oldData: string,
      newData: string,
      type: string
    ) {
      const db = getFirestore();

      let old_bit = fromBase64(oldData);
      let new_bit = fromBase64(newData);
      let ind = compareBitArrays(old_bit, new_bit);

      for (let qid of ind) {
        let updates = {};
        if (getBit(new_bit, qid) > getBit(old_bit, qid)) {
          // new > old, user adds a new rate
          if (type === "good") {
            updates = {
              good_count: increment(1),
            };
          } else {
            updates = {
              bad_count: increment(1),
            };
          }
        } else {
          //getBit(new_bit, qid) < getBit(old_bit, qid), user removed a rate
          if (type === "good") {
            updates = {
              good_count: increment(-1),
            };
          } else {
            updates = {
              bad_count: increment(-1),
            };
          }
        }
        const docRef = doc(db, "Stats", qid.toString());
        batch.update(docRef, updates);
      }
      return batch;
    },
    async updateRatingToDatabase() {
      const db = getFirestore();
      var batch = writeBatch(db);

      batch = this._ratingBatchGenerate(
        batch,
        this.snapShot.good_history,
        this.dataList.good_history,
        "good"
      );

      batch = this._ratingBatchGenerate(
        batch,
        this.snapShot.bad_history,
        this.dataList.bad_history,
        "bad"
      );

      await batch.commit();
    },
  },
  persist: true,
});
