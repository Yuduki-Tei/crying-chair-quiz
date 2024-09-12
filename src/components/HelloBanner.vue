<template>
  <Modal modalTitle = "最新公告" confimText = "好喔" :showModal = "showModal">
    <p class="mb-1">這是一個開發中的Web App，有任何問題都可以從意見表單反映。</p>
      <p class = "mt-2 mb-0">2024/09/12</p>
      <li>修改了資料庫存取邏輯。</li>
      <li>現在按下結算畫面上面的OX可以跳到那個題目了。</li>
      <p class = "mt-2 mb-0">2024/09/10</p>
      <li>修復了神奇的按鈕閃爍問題。我覺得我很棒。</li>
      <p class = "mt-2 mb-0">2024/09/08</p>
      <li>新增了題目投稿功能，歡迎投稿。</li>
      <li>結算畫面的題目不會自己亂滑了。</li>
      <li>更新每周挑戰，本周為主題式題目，是我重看老殘遊記的時候邊想出來的。</li>
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
    const helloID = "20240912";
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
