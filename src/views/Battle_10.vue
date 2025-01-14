<template>
<div v-if="connected">
  <MatchingRoom />
</div>
<div v-if="allReady">
  <Quiz pageTitle="對戰十題" :qType="mode"/>
</div> 
</template>

<script lang="ts">
import { defineComponent, ref, onUnmounted, computed } from 'vue';
import Quiz from "../components/Quiz.vue";
import MatchingRoom from "../components/MatchingRoom.vue";
import { useSocketStore } from '../store';

export default defineComponent({
  name: 'Battle_10',
  components: { MatchingRoom, Quiz },
  setup(){
    const socket = useSocketStore();
    socket.connect(import.meta.env.VITE_TMP_SOCKET_URL);
    const connected = computed(() => socket.socketConnected);
    const allReady = ref<boolean>(false);
    const mode = ref<string>('battle');

    const updateModeText = (roomId: string) => {
      mode.value = 'battle' + roomId;
    }

    socket.onEvent('room_created', (data: any) => {
      updateModeText(data.room_id);
    })
  
    socket.onEvent('room_joined', (data: any) => {
      updateModeText(data.room_id);
    })

    socket.onEvent('room_left', () => {
      allReady.value = false;
    })

    socket.onEvent('all_ready', () => {
      allReady.value = true;
    })


    onUnmounted(() => {
      if (socket){
        socket.disconnect();
      }
    });
    return {
      allReady,
      connected,
      mode,
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