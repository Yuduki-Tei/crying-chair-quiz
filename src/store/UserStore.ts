import { defineStore } from "pinia";
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  increment,
  query,
  collection,
  where,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { User, getAuth } from "firebase/auth";
import { getBit, fromBase64, compareBitArrays } from "../composables";

interface userData {
  uid: string;
  user_name: string;
  user_mail: string;
  answer_history: string;
  correct_history: string;
  rate_history: string;
}

export const useUserStore = defineStore("User", {
  state: () => ({
    snapShot: {} as userData,
    dataList: {} as userData,
    isInitialized: false,
  }),
  actions: {
    initLocalStore(user: User) {
      if (this.isInitialized) {
        return;
      } else {
        this.dataList = {
          uid: user.uid || "",
          user_name: user.displayName || "",
          user_mail: user.email || "",
          answer_history: "",
          correct_history: "",
          rate_history: "",
        };
      }
      this.snapShoot();
      this.isInitialized = true;
    },

    resetStore() {
      this.$reset();
    },

    snapShoot() {
      this.snapShot = {
        uid: this.dataList.uid,
        user_name: this.dataList.user_name,
        user_mail: this.dataList.user_mail,
        answer_history: this.dataList.answer_history,
        correct_history: this.dataList.correct_history,
        rate_history: this.dataList.rate_history,
      };
    },

    async checkUserAccount() {
      const user = getAuth().currentUser;
      if (!user) {
        return;
      }
      if (!this.isInitialized) {
        this.initLocalStore(user);
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
          rate_history: "",
        });
      } else {
        const data = userDoc.data();
        this.dataList = {
          uid: data.uid,
          user_name: data.user_name,
          user_mail: data.user_mail,
          answer_history: data.answer_history,
          correct_history: data.correct_history,
          rate_history: data.rate_history,
        };
      }
      this.snapShoot();
    },
    async updateLastActiveTime() {
      const db = getFirestore();
      const user = getAuth().currentUser;
      if (!user) {
        return;
      }
      const userDocRef = doc(db, "users", user.uid);
      const updates = {
        last_active_time: new Date().toISOString(),
      };
      await updateDoc(userDocRef, updates);
    },
    async updateResToDatabase() {
      let ans_comp =
        this.dataList.answer_history === this.snapShot.answer_history;
      let rate_comp = this.dataList.rate_history === this.snapShot.rate_history;

      if (!ans_comp && !rate_comp) {
        return;
      } else {
        const db = getFirestore();
        const user = getAuth().currentUser;
        if (!user) {
          return;
        }
        const userDocRef = doc(db, "users", user.uid);

        const updatedData = {
          ...this.dataList,
          answer_history: this.dataList.answer_history,
          correct_history: this.dataList.correct_history,
          rate_history: this.dataList.rate_history,
        };

        await setDoc(userDocRef, updatedData);
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

        const q = query(collection(db, "Stats"), where("qid", "==", index));
        const querySnapshot = await getDocs(q);

        for (const doc of querySnapshot.docs) {
          await updateDoc(doc.ref, updates);
        }
      }
    },
  },
  persist: true,
});
