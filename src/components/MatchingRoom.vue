<template>
  <div class="text-center">
      <button @click="connectSocket" :disabled="socketConnected">連</button>
      <button @click="disconnectSocket" :disabled="!socketConnected">斷</button>
      <button @click="createRoom" :disabled="!socketConnected">開</button>
      <button @click="joinRoom" :disabled="!socketConnected">加</button>
      <button @click="leaveRoom" :disabled="!socketConnected">離</button>

    <p v-if="socketConnected">WebSocket 已連接</p>
    <p v-if="!socketConnected">WebSocket 尚未連接</p>

    <div>
      <p>接收到的訊息：</p>
      <pre>{{ message }}</pre>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref, onMounted, computed } from 'vue';
import { useSocketStore } from '../store';

export default defineComponent({
  name: 'MatchingRoom',
  setup() {
    const socket = useSocketStore();
    const message = computed(() => socket.message);

    const createRoom = () => {
      socket.emitEvent('create_room')
    }

    const joinRoom = () => {
      let roomId = prompt('enter room id')
      socket.emitEvent('join_room', roomId)
    }

    const leaveRoom = () => {
      socket.emitEvent('leave_room')
    }

    const connectSocket = () =>{
      socket.connect('https://hfffcf-5000.csb.app/')
    }

    const disconnectSocket = () =>{
      socket.disconnect()
    }
    return {
      connectSocket,
      disconnectSocket,
      createRoom,
      joinRoom,
      leaveRoom,
      message,
      socketConnected,
    };
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