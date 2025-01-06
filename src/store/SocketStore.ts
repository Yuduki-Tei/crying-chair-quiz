import { defineStore } from 'pinia';
import { io, Socket } from 'socket.io-client';

export const useSocketStore = defineStore('Socket',{
  state: () => ({
    socket: null as Socket | null,
    message: "",
    socketConnected: false,
  }),
  actions: {
    connect(url: string) {
      if (!this.socket) {
        this.socket = io(url);

        this.socket.on('connect', () => {
          this.socketConnected = true;
          console.log('Socket connected');
        });

        this.socket.on('disconnect', () => {
          this.socketConnected = false;
          console.log('Socket disconnected');
        });
      }
    },

    onEvent(event: string, callback?: (data: any) => void) {
      this.socket?.on(event, (data: any) => {
        this.message = data;
        console.log(`Received message for event ${event}:`, data);

        if (callback) {
          callback(data);
        }
      });
    },

    emitEvent(event: string, data?: any) {
      if (this.socket && this.socketConnected) {
        this.socket.emit(event, data);
        console.log(`Event ${event} emitted with data:`, data);
      } else {
        console.warn(`Cannot emit event: ${event}. Socket is not connected.`);
      }
    },

    disconnect() {
      if (this.socket) {
        this.socket.removeAllListeners();
        this.socket.disconnect();
        this.socket = null;
      }
      this.socketConnected = false;
    },
  },
});