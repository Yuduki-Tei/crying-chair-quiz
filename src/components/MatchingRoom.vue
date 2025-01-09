<template>
  <div class="text-center">
      <button @click="connectSocket" :disabled="connected">連</button>
      <button @click="disconnectSocket" :disabled="!connected">斷</button>
      <button @click="createRoom" :disabled="!connected">開</button>
      <button @click="joinRoom" :disabled="!connected">加</button>
      <button @click="getReady" :disabled="!connected">準</button>
      <button @click="leaveRoom" :disabled="!connected">離</button>

    <p v-if="connected">WebSocket 已連接</p>
    <p v-if="!connected">WebSocket 尚未連接</p>

    <div>
      <p>接收到的訊息：</p>
      <p>{{ message }}</p>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
import { useSocketStore, useUserStore } from '../store';

export default defineComponent({
  name: 'MatchingRoom',
  setup() {
    const socket = useSocketStore();
    const user = useUserStore();
    const connected = computed(() => socket.socketConnected)
    const message = computed(() => socket.message)

    const createRoom = () => {
      socket.emitEvent('create_room')
    }

    const joinRoom = () => {
      let roomId = prompt('enter room id')
      socket.emitEvent('join_room', {'room_id': roomId, 'name': user.dataList.user_name})
    }

    const getReady = () => {
      socket.emitEvent('sync_ready', {'name': user.dataList.user_name})
    }

    const leaveRoom = () => {
      socket.emitEvent('leave_room', {'name': user.dataList.user_name})
    }

    const connectSocket = () =>{
      socket.connect(import.meta.env.VITE_TMP_SOCKET_URL)
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
      getReady,
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