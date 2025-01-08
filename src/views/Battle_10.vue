<template>
  <Quiz pageTitle="對戰十題" qType="battle"/>
  <MatchingRoom />
</template>

<script>
import { defineComponent, ref, onMounted } from 'vue';
import Quiz from "../components/Quiz.vue";
import MatchingRoom from "../components/MatchingRoom.vue";
import { useQuestionStateStore, useSocketStore } from '../store';

export default defineComponent({
  name: 'Battle_10',
  components: { MatchingRoom, Quiz },
});
</script>

<style scoped>
button {
  margin: 10px;
  padding: 10px;
  font-size: 16px;
  cursor: pointer;
}

p {
  font-size: 18px;
}
</style>