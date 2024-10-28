<template>
  <Modal modalTitle="最新公告" confimText="好喔" :showModal="showModal" style="height: 120vh">
    <p class="mb-1">
      這是一個開發中的Web App，有任何問題都可以從意見表單反映。
    </p>
    <p class="mt-2 mb-0">2024/10/28</p>
    <li>修正倒數與文字顯示的實作方式。現在倒數有100ms的進入保護，應該安全一點。</li>
    <p class="mt-2 mb-0">2024/10/27</p>
    <li>更新了每週問題，本週也是關聯題組。</li>
    <li>大改了存取資料庫與localStorage的使用的方式。</li>
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
    const helloID = "20241028";
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
