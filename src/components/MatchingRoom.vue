<template>
  <div class="text-center">
      <button @click="connectSocket" :disabled="connected">連</button>
      <button @click="disconnectSocket" :disabled="!connected">斷</button>
      <button @click="createRoom" :disabled="!connected">開</button>
      <button @click="joinRoom" :disabled="!connected">加</button>
      <button @click="leaveRoom" :disabled="!connected">離</button>

    <p v-if="connected">WebSocket 已連接</p>
    <p v-if="!connected">WebSocket 尚未連接</p>

    <div>
      <p>接收到的訊息：</p>
      <p>{{ message }}</p>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref, onUnmounted, computed } from 'vue';
import { useSocketStore } from '../store';

export default defineComponent({
  name: 'MatchingRoom',
  setup() {
    const socket = useSocketStore();
    const connected = computed(() => socket.socketConnected)
    const message = computed(() => socket.message);

    const createRoom = () => {
      socket.onEvent('room_created')
      socket.onEvent('room_joined')
      socket.onEvent('room_left')
      socket.emitEvent('create_room')
    }

    const joinRoom = () => {
      socket.onEvent('room_joined')
      socket.onEvent('room_left')
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
    onUnmounted(() => {
      if (socket.value) {
        socket.value.removeAllListeners();
        disconnectSocket();
      }
    });

    return {
      connectSocket,
      disconnectSocket,
      createRoom,
      joinRoom,
      leaveRoom,
      message,
      connected,
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