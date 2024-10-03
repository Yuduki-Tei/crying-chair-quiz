<template>
  <Modal modalTitle="最新公告" confimText="好喔" :showModal="showModal">
    <p class="mb-1">
      這是一個開發中的Web App，有任何問題都可以從意見表單反映。
    </p>
    <p class="mt-2 mb-0">2024/10/03</p>
    <h6>・新增了讚 / 爛按鈕系統，爛題目無所遁形！</h6>
    <li>・修改了計分邏輯與分數顯示方式。</li>
    <ol class="mb-0">
      - 提高了分數上限。
    </ol>
    <ol class="mb-0">
      - 提高了答對題目的基礎得分。
    </ol>
    <ol class="mb-1">
      - 現在分數會在遊戲過程中動態顯示。
    </ol>
    <li>・修改了正解率雷達圖。</li>
    <ol class="mb-0">
      - 修正了正解率為0時錯誤顯示的問題。
    </ol>
    <ol class="mb-1">
      - 現在雷達圖會顯示答對題數 / 已回答題數。
    </ol>
    <li>・修改了分類十題頁面。</li>
    <ol class="mb-">
      - 現在分類十題頁面會顯示已回答題數 / 總題數。
    </ol>
    <li>・修改了一部份的UI。</li>
    <p class="mt-2 me-5 text-end">by dev</p>
  </Modal>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import Modal from "./Modal.vue";
export default defineComponent({
  name: "HelloBanner",
  components: { Modal },
  setup() {
    const helloID = "20241003";
    const showModal = ref<boolean>(true);

    if (
      !localStorage.getItem("helloID") ||
      localStorage.getItem("helloID") !== helloID
    ) {
      showModal.value = true;
      localStorage.setItem("helloID", helloID);
    } else {
      showModal.value = false;
    }
    return {
      showModal,
    };
  },
});
</script>
