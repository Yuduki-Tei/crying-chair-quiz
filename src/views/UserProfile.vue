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
    <p>信箱 : {{ mail }} </p>
    <p>正解率 : {{ correctRating }} %</p>
  </div>
</div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from "vue";
import { useUserStore } from "../store";
import { fromBase64, sumBits } from "../composables";
import DropDown from "../components/DropDown.vue";
import Loading from "../components/Loading.vue";

export default defineComponent({
  name: "UserProfile",
  components: { DropDown, Loading },
  setup() {
    const loading = ref(true);
    const user = useUserStore();
    const data = user.dataList;
    const mail = data.user_mail;

    let cor_bit = fromBase64(data.correct_history);
    let ans_bit = fromBase64(data.answer_history);

    const correctRating = Math.floor((sumBits(cor_bit) / sumBits(ans_bit) || 0) * 10000) / 100;

    onMounted(async() => {
      if (!data.correct_history || !data.answer_history) {
        await user.checkUserAccount();
      } 
      loading.value = false;
    })
    return {
      mail,
      loading,
      correctRating,
    };
  },
});
</script>
