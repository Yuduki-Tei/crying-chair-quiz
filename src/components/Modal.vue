<template>
    <div v-if="showModal && buttonShowModal" class="modal position-fixed d-block" style="height:auto; overflow-y: hidden;">
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
              {{ confirmText }}
            </button>
            <router-link v-if = "reject" to = "/menu" replace>
              <button
                type="button"
                class="btn btn-secondary w-100"
                data-bs-dismiss="modal"
              >
              {{ rejectText }}
              </button>
            </router-link>
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
    },
    confirmText:{
      type: String,
      default: "好喔"
    },
    reject:{
      type: Boolean,
      default: false,
    },
    rejectText:{
      type: String,
      default: "返回"
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

<style lang="css" scoped>
.modal {
  background-color: var(--mygray-dark);
}
</style>