<template>
  <Modal modalTitle="最新公告" confimText="好喔" :showModal="showModal" style="height: 120vh">
    <p class="mb-1">
      這是一個開發中的Web App，有任何問題都可以從意見表單反映。
    </p>
    <p class="mt-2 mb-0">2024/11/17</p>
    <li>本週因為睡眠不足頭很痛，題目停更一週。</li>
    <li>發現並修復了無法正確與database同步的問題，但過去三周的資料死掉了:(</li>
    <p class="mt-2 mb-0">2024/11/10</p>
    <li>更新了每週問題，本週也是關聯題組。</li>
    <li>稍微修改了部分UI。</li>
    <li>修改了CSS的引入方式，現在從0開始載入大概會快一點點。</li>
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
    const helloID = "20241117";
    const showModal = ref<boolean>(true);

    if (
      !localStorage.getItem("helloID") ||
      localStorage.getItem("helloID") !== helloID
    ) {
      showModal.value = true;
      localStorage.setItem("helloID", helloID);
      const requiredKeys = ["userNameLastUpdate", "catLastUpdate", "maxQid", "maxQidLastUpdate", "helloID", "User", "Cat"];
      const allKeys = Object.keys(localStorage);

      allKeys.forEach((key) => {
        if (!requiredKeys.includes(key)) {
          localStorage.removeItem(key);
        }
      });
    } else {
      showModal.value = false;
    }

    return {
      showModal,
    };
  },
});
</script>
