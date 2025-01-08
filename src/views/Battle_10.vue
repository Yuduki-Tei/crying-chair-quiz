<template>
<div v-if="connected">
  <Quiz pageTitle="對戰十題" qType="battle"/>
  <MatchingRoom />
</div> 
</template>

<script>
import { defineComponent, ref, onUnmounted, computed } from 'vue';
import Quiz from "../components/Quiz.vue";
import MatchingRoom from "../components/MatchingRoom.vue";
import { useQuestionStateStore, useSocketStore } from '../store';

export default defineComponent({
  name: 'Battle_10',
  components: { MatchingRoom, Quiz },
  setup(){
    const socket = useSocketStore();
    socket.connect(import.meta.env.VITE_TMP_SOCKET_URL);
    const connected = computed(() => socket.socketConnected);
    onUnmounted(() => {
      if (socket.value){
        socket.removeAllListeners();
        socket.disconnect();
      }
    });
    return {
      connected,
    }
  }
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