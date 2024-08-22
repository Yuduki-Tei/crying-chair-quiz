<template>
  <Quiz pageTitle="每週十題" qType="weekly" />
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Quiz from "../components/Quiz.vue";

export default defineComponent({
  name: "Weekly_10",
  components: { Quiz },
});
</script>
