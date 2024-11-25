import { defineStore } from "pinia";
import axios from "axios";
import { getFirebaseIdToken } from "../services/firebase";
import { getBit, fromBase64, getQid } from "../composables";

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
    dataList: {} as userData,
    apiUrl: import.meta.env.VITE_BACKEND_API_URL
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
    
    async _updateUserData(data: Record<string, any>){
      try {
        await axios.put(
          `${this.apiUrl}/user-data`,
          {...data},
          {
            headers: {
              Authorization: await getFirebaseIdToken(),
            },
          }
        );
      } catch (error) {
        console.error("Error updating user data", error);
      }
    },

    async checkUserAccount() {
      try {
        const response = await axios.get(
          `${this.apiUrl}/user-data`,
          {
            headers: {
              Authorization: await getFirebaseIdToken(),
            },
          }
        );
        this.dataList = response.data

      }catch (error) {
        console.error("Error fetching user data", error);
      }
    },

    async updateRes(){
      let data = {
        answer_history : this.dataList.answer_history,
        correct_history : this.dataList.correct_history,
        bad_history: this.dataList.bad_history,
        good_history : this.dataList.good_history,
        last_active_time : new Date().toISOString()
      }
      await this._updateUserData(data)
    },

    async updateUserName(name: string) {
      await this._updateUserData({ user_name: name });
    },
  },
    persist: true,
  });
