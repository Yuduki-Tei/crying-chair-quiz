<template>
  <div class="container d-flex justify-content-center pt-5 mt-5">
    <div class="spinner-grow text-correct" role="status">
    </div>
  </div>
  <div class = "mt-3 text-center">
    <h6>{{ message }}</h6>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from "vue";
export default defineComponent({
  name: "Loading",
  props:{
    message: {type:String, default: "Now Loading..."},
  },
  setup(props) {
    const message = computed(() => props.message);
    return { message };
  }
});
</script>
