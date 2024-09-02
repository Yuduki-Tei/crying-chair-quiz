<template>
  <Modal modalTitle = "最新公告" :showModal = "showModal">
    <p class="mb-1">這是一個開發中的Web App，正在努力做使用者投稿問題的部分。</p>
      <p class = "mt-2 mb-0">2024/08/25</p>
      <li>新增100題，已經沒有庫存題目了</li>
      <li>更新每周挑戰，本周為主題式題目，(香港的朋友們抱歉)</li>
      <p class = "mt-2 mb-0">2024/08/26</p>
      <li>修正了mac的enter鍵觸發問題</li>
      <li>修正按鍵邏輯，現在一定要先按鈴才能回答，避免送出空答案。</li>
      <p class = "mt-2 mb-0">2024/08/25</p>
      <li>新增100題</li>
      <li>更新每周挑戰，現在每周挑戰題目難易度跨度更大了</li>
      <p class = "mt-2 mb-0">2024/08/23</p>
      <li>現在Mac使用者在輸入答案期間按Enter不會錯誤送出，並可以改用ctrl/cmd + enter送出</li>
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
    const helloID = "20240901"
    const showModal = ref<Boolean>();
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
