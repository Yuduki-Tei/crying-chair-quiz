<template>
  <Modal modalTitle="最新公告" confimText="好喔" :showModal="showModal" style="height: 120vh">
    <p class="mb-1">
      這是一個開發中的Web App，有任何問題都可以從意見表單反映。
    </p>
    <p class="mt-2 mb-0">2024/11/24</p>
    <li>更新每周十題，是用我在看某部作品的時候看到的keyword出的。</li>
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
    const helloID = "20241124";
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
