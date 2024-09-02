<template>
    <div v-if="showModal && buttonShowModal" class="modal position-fixed d-block p-4 py-md-5">
      <div class="modal-dialog" role="document">
        <div class="modal-content shadow">
          <div class="modal-header">
            <h1 class="modal-title fs-6">{{ modalTitle }}</h1>
          </div>
          <div class="modal-body">
            <slot></slot>
          </div>
          <div class="modal-footer flex-column align-items-stretch w-50 pb-3 border-top-0 m-auto">
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
import { defineComponent, ref } from 'vue';
export default defineComponent({
  name: "Modal",
  props: {
    showModal: {
      type: Boolean,
      default: true,
    },
    modalTitle: {
      type: String,
      default: "最新公告"
    }
  },
  setup() {
    const buttonShowModal = ref<boolean>(true);
    const closeModal = () => {
        buttonShowModal.value = false;
    }
    return{
        closeModal,
        buttonShowModal
    }
  }
});
</script>