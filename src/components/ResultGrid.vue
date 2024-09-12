<template>
  <div class="row pt-0 mb-1 m-auto">
    <div
      v-for="(item, index) in results"
      class="col m-0 p-0 ratio ratio-1x1 grid-item"
      @click="$emit('select-grid', index)"
    >
      <span
        class="font-monospace fs-2 fw-bold d-flex align-items-center justify-content-center"
        :class="{
          'text-correct': item.correct,
          'text-incorrect': !item.correct,
          active: index === act,
        }"
      >
        <i
          class="d-flex align-items-center justify-content-center"
          v-if="item.done"
          :class="{
            'bi bi-circle': item.correct,
            'bi bi-x-lg': !item.correct,
          }"
        ></i>
      </span>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { useResultStore } from "../store";

export default defineComponent({
  name: "ResultGrid",
  props: {
    act: { type: Number, required: true },
  },
  setup() {
    const results = useResultStore().dataList;
    return {
      results,
    };
  },
});
</script>