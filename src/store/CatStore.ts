import {
  collection,
  getDocs,
  getFirestore,
  limit,
  orderBy,
  query,
} from "firebase/firestore";
import { defineStore } from "pinia";

export const useCatStore = defineStore("Cat", {
  state: () => ({
    Cats: {} as { [key: string]: number[] },
  }),
  actions: {
    getCat(cat: string) {
      return this.Cats[cat] || [];
    },

    async updateCat() {
      const db = getFirestore();
      const q = query(
        collection(db, "Category"),
        orderBy("qids", "asc"),
        limit(10)
      );
      const querySnapshot = await getDocs(q);
      const fetchedCats = querySnapshot.docs.map((doc) => {
        const cat = doc.id;
        return { cat, data: doc.data() };
      });
      fetchedCats.forEach(({ cat, data }) => {
        this.Cats[cat] = data["qids"];
      });
    },
  },
  persist: true,
});
