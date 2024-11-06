<template>
  <DropDown />
  <Loading v-if="loading" message = "使用者資料載入中..." />
  <div
    v-if="!loading"
    class="container d-flex flex-column flex-md-row justify-content-center align-items-center pt-5"
    style="max-width: 600px"
    v-on:mousedown = "handleContainerClick"
  >
    <div class="row d-flex justify-content-center text-center flex-grow-1">
      <div class="d-block justify-content-center text-center">
        <div>
          <p v-if="errorMessage" class="alert justify-content-center text-center alert-danger p-1 m-1 fw-normal">
              {{ errorMessage }}
          </p>
        </div>
        <p v-if="!isEditing" class="fw-medium">
          {{ name }}
          <span @click ="enableEditing" class="text-secondary text-end" >
            <i class="bi bi-pencil text-end"></i>
        </span>
        </p>
        <div v-if="isEditing" class="d-flex align-items-center mb-2" ref="editContainer">
          <input type="text" v-model="editName" class="form-control me-2" />
          <div>
            <i @click="updateName" class="bi bi-check-lg fs-4"></i>
          </div>
        </div>
      </div>
      <label for="bar" class = "info-text">平均正解率 : {{ correctRating }} %</label>
      <CountdownBar id="bar" :barLength="correctRating" style="height: 8px; max-width: 240px" />
    </div>
    <div
      class="d-flex align-items-center mt-3 mt-md-0"
      style="max-width: 300px; flex-shrink: 1;"
    >
      <RadarChart v-if="!loading" :correctRates="catCorrects" :questionCounts ="questionCounts"/>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from "vue";
import { useUserStore, useQuestionStore } from "../store";
import { fromBase64, sumBits, getBit } from "../composables";
import CountdownBar from "../components/CountdownBar.vue";
import DropDown from "../components/DropDown.vue";
import Loading from "../components/Loading.vue";
import RadarChart from "../components/RadarChart.vue";

export default defineComponent({
  name: "UserProfile",
  components: { DropDown, Loading, RadarChart, CountdownBar },
  setup() {
    const errorMessage = ref("");
    const loading = ref(true);
    const catCorrects =  ref<number[]>([]);
    const questionCounts = ref<string[]>([]);
    const user = useUserStore();
    const data = user.dataList;
    const name = ref(data.user_name || "尚未設定名稱");
    const editName = ref(data.user_name);
    const isEditing = ref(false);
    const qStore = useQuestionStore();
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
    let ans_bit = fromBase64(data.answer_history); // transfer base64string to binary

    const correctRating = Math.floor((sumBits(cor_bit) / sumBits(ans_bit) || 0) * 10000) / 100; // calculate percentage

    const calculateCatCorrect = async (cat: string) => { // display correct_count, attempted_count, correct rate by category
      let qids = new Set(await qStore.fetchCategoryQids(cat));

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
      questionCounts.value.push(`${cor_cnt}/${ans_cnt}`)
    }

    const enableEditing = () => { //name editing
      let last = localStorage.getItem('userNameLastUpdate');
      if(last && !(new Date().getTime() - new Date(last).getTime() >= 1000 * 60 * 60 * 24)){
        errorMessage.value = "兩次名稱更新間隔不可低於24小時";
        return
      }
      else{
        isEditing.value = true;
      }
    };

    const cancelEdit = () => {
      editName.value = name.value;
      isEditing.value = false;
    };

    const updateName = async () => {
      if (editName.value.length < 1){
        errorMessage.value = "請輸入使用者名稱";
        cancelEdit();
        return
      }
      else if(editName.value.length > 15){
        errorMessage.value = "使用者名稱必須小15個字";
        cancelEdit();
        return
      }
      else if(editName.value === name.value){
        errorMessage.value = "名稱無變更";
        cancelEdit();
        return
      }
      else errorMessage.value = "";
      try {
        await user.updateUserName(editName.value);
        localStorage.setItem('userNameLastUpdate', new Date().toISOString());
        name.value = editName.value;
        data.user_name = editName.value;
        isEditing.value = false;
      } catch (error) {
        console.error('failed to change name name', error);
        alert('failed to change name name');
      }
    };

    const handleContainerClick = (event: MouseEvent) => { //handle click outside of input box to cancel name editing
      var element = event.target as HTMLElement;
      if (!isEditing.value || element.tagName.toUpperCase() === 'INPUT') {
        return;
      }
      else if (element.tagName.toUpperCase() === 'I'){
        enableEditing();
      }
      else cancelEdit();
    };
    onMounted(async() => {
      for (const cat of allCats) {
        await calculateCatCorrect(cat);
      };
      loading.value = false;
    })
    return {
      name,
      loading,
      correctRating,
      catCorrects,
      questionCounts,
      editName,
      isEditing,
      errorMessage,
      enableEditing,
      cancelEdit,
      updateName,
      handleContainerClick,
    };
  },
});
</script>

<style scoped>
i{
  cursor: pointer;
}
</style>
