import { defineStore } from "pinia";
interface resData {
  interval: number;
  point: number;
  answer: string;
  correct: boolean;
  done: boolean;
  skipped: boolean;
}

export const useResultStore = defineStore("Result", {
  state: () => ({
    total: 0,
    dataList: [] as resData[],
  }),
  actions: {
    initDataList() {
      var data = Array.from({ length: 10 }, () => ({
        answer: "",
        interval: 0,
        correct: false,
        point: 0,
        done: false,
        skipped: false,
      }));
      this.dataList = data;
    },
    clearDataList() {
      this.total = 0;
      this.dataList = [];
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
