<template>
  <Modal modalTitle = "最新公告" confimText = "好喔" :showModal = "showModal">
    <p class="mb-1">這是一個開發中的Web App，有任何問題都可以從意見表單反映。</p>
      <p class = "mt-2 mb-0">2024/09/25</p>
      <li>突然收到一堆題目，感動到一臉涕泗縱橫。會盡速處理爭取本周末上線。</li>
      <p class = "mt-2 mb-0"></p>
      <li>新增了三個功能按鈕，可以在每週挑戰以外的模式中使用。</li>
      <li> ・ 一字提示 : 告訴你答案第一個字。</li>
      <li> ・ 請你給我多一點點時間 : 讓你思考時間變超長。</li>
      <li> ・ 讓我看看 : 題目會多顯示幾個字。</li>
      <li>目前一輪十題中每個功能可以各用一次，萬一有奇怪的bug，歡迎回報。</li>
      <p class = "mt-2 mb-0">2024/09/22</p>
      <li>更新每週挑戰，本週是答案關聯型的題組。</li>
      <p class = "mt-2 mb-0">2024/09/08</p>
      <li>新增了題目投稿功能，歡迎投稿。</li>
      <p class="mt-2 me-5 text-end">by dev</p>
  </Modal>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import Modal from "./Modal.vue";
export default defineComponent({
  name: "HelloBanner",
  components:{ Modal },
  setup() {
    const helloID = "20240925";
    const showModal = ref<boolean>(true);

    if (!localStorage.getItem("helloID") || localStorage.getItem("helloID") !== helloID) {
      showModal.value = true;
      localStorage.setItem("helloID", helloID);
    }
    else{
      showModal.value = false;
    }
    return {
      showModal,
    };
  },
});
</script>
