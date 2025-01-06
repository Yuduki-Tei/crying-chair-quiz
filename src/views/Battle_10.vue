<template>
  <Quiz pageTitle="對戰十題" qType="random"/>
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
  setup() {
    const qState = useQuestionStateStore();
    const socket = useSocketStore();

    const onSyncPause = () => {
      consloe.log('sync paused')
      qState.pauseQuestion()
      qState.setDisplaySpeed(0)
    }
    socket.onEvent('pause_synced', onSyncPause)
  },
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