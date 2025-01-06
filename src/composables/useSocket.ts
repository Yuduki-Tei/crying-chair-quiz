import { ref } from 'vue';
import { io } from 'socket.io-client';

export function useSocket(url:string) {
  const socket = ref();
  const socketConnected = ref(false);

  const connect = () => {
    socket.value = io(url);
    socketConnected.value = true;
  };

  const onEvent = (event: string, callback: (data: any) => void) => {
    socket.value?.on(event, callback);
  };
  
  const emitEvent = (event: string, data?: any) => {
    socket.value?.emit(event, data);
  };

  const disconnect = () => {
    if (socket.value) {
      socket.value.removeAllListeners();
      socket.value.disconnect();
    }
    socketConnected.value = false;
  };

  return {
    socket,
    onEvent,
    emitEvent,
    connect,
    disconnect,
    socketConnected,
  };
}