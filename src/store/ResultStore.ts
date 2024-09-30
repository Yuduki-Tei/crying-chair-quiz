import { defineStore } from "pinia";
interface resData {
  interval: number;
  point: number;
  answer: string;
  correct: boolean;
  rate: boolean;
  done: boolean;
}

export const useResultStore = defineStore("Result", {
  state: () => ({
    isWeekly: false,
    total: 0,
    dataList: [] as resData[],
    length: 0,
  }),
  actions: {
    setType(type: string) {
      this.isWeekly = type === "weekly";
    },
    initDataList() {
      var data = Array.from({ length: 10 }, () => ({
        answer: "",
        interval: 0,
        correct: false,
        rate: false,
        point: 0,
        done: false,
      }));
      this.dataList = data;
      this.length = this.dataList.length;
    },
    clearDataList() {
      this.total = 0;
      this.dataList = [];
      this.length = this.dataList.length;
      this.isWeekly = false;
    },
    getRes(index: number) {
      if (index >= 0 && index < this.dataList.length) {
        return this.dataList[index];
      } else {
        throw new Error("index exceed");
      }
    },
    setRes(index: number, newData: Partial<resData>) {
      if (index >= 0 && index < this.dataList.length) {
        this.dataList[index] = { ...this.dataList[index], ...newData };
      } else {
        throw new Error("index exceed");
      }
    },
  },
});
