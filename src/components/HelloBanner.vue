<template>
  <Modal modalTitle="最新公告" confimText="好喔" :showModal="showModal" style="height: 120vh">
    <p class="mb-1">
      <li>由於這個app和作者的固定團的題源相衝，常常顧此失彼。考慮到這邊活躍人數也不多，因此這邊題目改為不定期更新。</li>
      <li>如果有參加固定團的意願請從回報表單隨便選一個適當的欄位留下你的discord ID，我有看到會加你詳談。</li>
    </p>
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
    // const helloID = "20250511";
    const showModal = ref<boolean>(true);

    // if (
    //   !localStorage.getItem("helloID") ||
    //   localStorage.getItem("helloID") !== helloID
    // ) {
    // showModal.value = true;
    // localStorage.setItem("helloID", helloID);
    // const requiredKeys = ["userNameLastUpdate", "catLastUpdate", "maxQid", "maxQidLastUpdate", "helloID", "User", "Cat"];
    // const allKeys = Object.keys(localStorage);

    // allKeys.forEach((key) => {
    //   if (!requiredKeys.includes(key)) {
    //     localStorage.removeItem(key);
    //   }
    // });
    // } else {
    //   showModal.value = false;
    // }

    return {
      showModal,
    };
  },
});
</script>
