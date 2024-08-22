<template>
<div class="modal modal-sheet position-static d-block p-4 py-md-5" tabindex="-1" role="dialog" id="modalSheet">
  <div class="modal-dialog" role="document">
    <div class="modal-content rounded-4 shadow">
      <div class="modal-header border-bottom-0">
        <h1 class="modal-title fs-5">哈囉</h1>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body py-0">
        <p>這是一個開發中的Web App，連這個Banner都是剛長出來的。</p>
        <i>如果你有任何問題，可以從右上角選單裡進行回報，也可以直接找我本人。</i>
        <p>大guy4john</p>
      </div>
      <div class="modal-footer flex-column align-items-stretch w-100 gap-2 pb-3 border-top-0">
        <button type="button" class="btn btn-lg btn-primary">好喔</button>
      </div>
    </div>
  </div>
</div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
  name: "HelloBanner",
});
</script>