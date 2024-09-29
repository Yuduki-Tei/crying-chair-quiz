<template>
  <Modal modalTitle = "最新公告" confimText = "好喔" :showModal = "showModal">
    <p class="mb-1">這是一個開發中的Web App，有任何問題都可以從意見表單反映。</p>
      <p class = "mt-2 mb-0">2024/09/17</p>
      <li>以後的每週題目會盡量固定在星期日的23:00(JST)左右更新。</li>
      <li>更新了使用者資料頁面，現在你可以：</li>
      <li>・更改使用者名稱(名稱目前沒有其他用途)</li>
      <li>・檢視自己的綜合正解率與分類正解率。數據會以首次答題為準。</li>
      <p class = "mt-2 mb-0">2024/09/15</p>
      <li>更新每週挑戰，本周勉強算主題式題目。</li>
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
    const helloID = "20240917";
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
