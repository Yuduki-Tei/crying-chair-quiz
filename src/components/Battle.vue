<template />
<script lang = "ts">
import { defineComponent } from 'vue';
import { useSocketStore, useQuestionStateStore } from '../store';
export default defineComponent({
    name: "Battle",
    emits: ['battle_pause', 'battle_answer', 'battle_start'],
    setup(_, { emit }){
        const socket = useSocketStore();
        const qState = useQuestionStateStore();
        const battlePause = (curPos: number) =>{
            socket.emitEvent('sync_pause', curPos);
        };
        const battleAnswer = (answer: string) =>{
            socket.emitEvent('sync_answer', answer);
        };
        const battleReady = () =>{
            socket.emitEvent('sync_ready')
        }
        const listenerActivate = () => {
            socket.onEvent('sync_pause', (data: any) => {
                qState.disableAll();
                emit('battle_pause', data.pos);
            });
            socket.onEvent('sync_answer', (data: any) => {
                emit('battle_answer', data.ans);
            });
            socket.onEvent('all_ready', (data: any) => {
                let startAt = data.start_at
                const now = Date.now() / 1000;
                const delay = Math.max(0, startAt - now) * 1000;
                setTimeout(() => {
                    emit('battle_start');
                }, delay);
            });
        };
        listenerActivate();

        return{
            battlePause,
            battleAnswer,
            battleReady,
        };
    },
});
</script>