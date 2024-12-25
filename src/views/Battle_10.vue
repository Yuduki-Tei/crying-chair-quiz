<template>
  <div>
    <h2>WebSocket 測試</h2>
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
import { defineComponent, ref, onMounted } from 'vue';
import { useSocket } from '../composables';

export default defineComponent({
  name: 'Battle_10',
  setup() {
    const message = ref([])
    const {connect, onEvent, disconnect, emitEvent, socketConnected } = useSocket('https://hfffcf-5000.csb.app/');


    const onMessageEvent = (data) => {
      message.value = data;
    }

    const createRoom = () => {
      emitEvent('create_room')
    }

    const joinRoom = () => {
      let roomId = prompt('enter room id')
      emitEvent('join_room', roomId)
    }

    const leaveRoom = () => {
      emitEvent('leave_room')
    }

    const connectSocket = () =>{
      connect()
      onEvent('room_created', onMessageEvent)
      onEvent('room_joined', onMessageEvent)
      onEvent('room_left', onMessageEvent)
    }

    const disconnectSocket = () =>{
      disconnect()
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