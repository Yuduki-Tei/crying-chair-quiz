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
        const listenerActivate = () => {
            socket.onEvent('sync_pause', (pos: number) => {
                qState.disableAll();
                emit('battle_pause', pos);
            });
            socket.onEvent('sync_answer', (ans: string) => {
                emit('battle_answer', ans);
            });
            socket.onEvent('sync_start', () => {
                emit('battle_start');
            });
        };
        listenerActivate();

        return{
            battlePause,
            battleAnswer,
        };
    },
});
</script>