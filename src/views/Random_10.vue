<template>
  <Quiz pageTitle="隨機十題" qType="random" />
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Quiz from "../components/Quiz.vue";

export default defineComponent({
  name: "Random_10",
  components: { Quiz },
});
</script>
