<template>
  <Modal modalTitle="最新公告" confimText="好喔" :showModal="showModal">
    <p class="mb-1">
      這是一個開發中的Web App，有任何問題都可以從意見表單反映。
    </p>
    <p class="mt-2 mb-0">2024/10/11</p>
    <li>修正了資料庫結構。</li>
    <li>現在評價可以修改與收回。</li>
    <li>現在使用者的正解紀錄會是你最後一次答題的紀錄，而非第一次。</li>
    <p class="mt-2 mb-0">2024/10/10</p>
    <li>修正了在不同裝置遊玩時資料庫評價紀錄會被錯誤覆蓋的問題。</li>
    <p class="mt-2 mb-0">2024/10/08</p>
    <li>現在你可以在結算頁面給題目評價了。</li>
    <p class="mt-2 mb-0">2024/10/06</p>
    <li>更新了每週問題，本週還是主題式題組。</li>
    <p class="mt-2 mb-0">2024/10/03</p>
    <li>・新增了讚 / 爛按鈕系統。</li>
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
    const helloID = "20241011";
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
