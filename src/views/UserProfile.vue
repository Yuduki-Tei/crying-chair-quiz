<template>
  <Loading v-if="loading" />
  <DropDown />
  <div
    v-if="!loading"
    class="container d-flex justify-content-center align-items-center pt-5"
    style="max-width: 450px"
  >
  <div class = "row justify-content-center text-center">
    <h3 class="m-3 text-center">使用者資料</h3>
    <label for="bar">平均正解率 : {{ correctRating }} %</label>
    <CountdownBar id="bar" :barLength="correctRating" style=" height: 8px; max-width: 250px" />
    <p>信箱 : {{ mail }} </p>
  </div>
</div>
<div
    class="container d-block justify-content-center align-items-center"
    style="max-width: 450px"
  >
    <RadarChart v-if="!loading" :correctRates= "catCorrects"/>
</div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from "vue";
import { useUserStore, useOnlineQuestionStore } from "../store";
import { fromBase64, sumBits, getBit } from "../composables";
import CountdownBar from "../components/CountdownBar.vue";
import DropDown from "../components/DropDown.vue";
import Loading from "../components/Loading.vue";
import RadarChart from "../components/RadarChart.vue";

export default defineComponent({
  name: "UserProfile",
  components: { DropDown, Loading, RadarChart, CountdownBar },
  setup() {
    const loading = ref(true);
    const catCorrects =  ref<number[]>([]);
    const user = useUserStore();
    const data = user.dataList;
    const mail = data.user_mail;
    const online = useOnlineQuestionStore();
    const allCats = [
          '文學',
          '理科',
          '地理',
          '社會',
          '生活',
          '歷史',
          '語言',
          '運動',
          '文化',
          '娛樂'
        ];

    let cor_bit = fromBase64(data.correct_history);
    let ans_bit = fromBase64(data.answer_history);

    const correctRating = Math.floor((sumBits(cor_bit) / sumBits(ans_bit) || 0) * 10000) / 100;

    const calculateCatCorrect = async (cat: string) => {
      let qids = new Set(await online.fetchCategoryQids(cat));

      let ans_cnt = 0;
      let cor_cnt = 0;

      qids.forEach((qid) => {
        if (qid >= 0 && qid < ans_bit.length * 8 && getBit(ans_bit, qid) === 1) {
          if (getBit(cor_bit, qid) === 1) {
            cor_cnt++;
          }
          ans_cnt++;
        }
      });

      catCorrects.value.push(Math.floor((cor_cnt / ans_cnt || 0) * 10000) / 100);
    }

    onMounted(async() => {
      if (!data.correct_history || !data.answer_history) {
        await user.checkUserAccount();
      };
      for (const cat of allCats) {
        await calculateCatCorrect(cat);
      };
      loading.value = false;
    })
    return {
      mail,
      loading,
      correctRating,
      catCorrects,
    };
  },
});
</script>
