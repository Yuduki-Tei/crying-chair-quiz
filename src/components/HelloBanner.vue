<template>
  <Modal modalTitle="最新公告" confimText="好喔" :showModal="showModal" style="height: 120vh">
    <p class="mb-1">
      這是一個開發中的Web App，有任何問題都可以從意見表單反映。
    </p>
    <p class="mt-2 mb-0">2024/10/24</p>
    <li>修正了倒數與文字顯示的實作方式。現在使用者最小化視窗的時候倒數還是會繼續。</li>
    <p class="mt-2 mb-0">2024/10/20</p>
    <li>更新了每週問題。</li>
    <p class="mt-2 mb-0">2024/10/16</p>
    <li>修正了資料庫結構，希望不要再有bug了。</li>
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
    const helloID = "20241024";
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

    const requiredKeys = ["userNameLastUpdate", "catLastUpdate", "maxQid", "maxQidLastUpdate", "helloID", "User", "Cat"];
    const allKeys = Object.keys(localStorage);

    allKeys.forEach((key) => {
      if (!requiredKeys.includes(key)) {
        localStorage.removeItem(key);
      }
    });

    return {
      showModal,
    };
  },
});
</script>
