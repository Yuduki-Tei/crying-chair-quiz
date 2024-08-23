<template>
  <div v-if="showModal" class="modal position-fixed d-block p-4 py-md-5">
    <div class="modal-dialog" role="document">
      <div class="modal-content shadow">
        <div class="modal-header">
          <h1 class="modal-title fs-6">最新公告</h1>
        </div>
        <div class="modal-body">
          <p class="mb-1">
            這是一個開發中的Web App，連這個公告功能都是剛長出來的。
          </p>
          <li>內容1</li>
          <li>內容2</li>
          <li>內容3</li>
          <p class="mt-1 me-5 text-end">by dev</p>
        </div>
        <div
          class="modal-footer flex-column align-items-stretch w-50 pb-3 border-top-0 m-auto"
        >
          <button
            @click="closeModal"
            type="button"
            class="btn btn-primary"
            data-bs-dismiss="modal"
          >
            好喔
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
export default defineComponent({
  name: "HelloBanner",
  setup() {
    const helloID = "20240823"
    const showModal = ref<Boolean>();
    if (!localStorage.getItem("helloID") || localStorage.getItem("helloID") !== helloID) {
      showModal.value = true;
    }
    else{
      showModal.value = false;
    }
    const closeModal = () => {
      showModal.value = false;
      localStorage.setItem("helloID", helloID);
    };
    return {
      showModal,
      closeModal,
    };
  },
});
</script>
