<template>
<CountdownBar :barLength="barLength"/>
</template>

<script lang = "ts">
import { defineComponent, ref } from 'vue';
import CountdownBar from './CountdownBar.vue';
import { watch } from 'vue';
export default defineComponent({
    name: "Countdown",
    components: {
        CountdownBar,
    },
    props:{
        countdownTime:{ type:Number, default:15,},
        ansLen:{ type:Number, default:0,},
        state:{ type:String, default:""},
    },
    emits: ['checkAnswer'],
    setup(props, {emit}) {
        const barLength = ref<number>(100);
        const countdownTime = props.countdownTime;
        var isCountingDown: boolean = false;
        var adjustedTime: number = countdownTime;
        var countdownId: number = 0;

        const calculateAdjustTime = () => {
            let len = props.ansLen
            adjustedTime = countdownTime;
            if (len >= 4) {
              adjustedTime = countdownTime * 1.4;
            } else if (len <= 2 && len > 0) {
              adjustedTime = countdownTime * 0.8;
            } else if (len < 0 && Math.abs(len) >= 2) {
              adjustedTime = countdownTime * 1.4;
            }
        };
      
        const plusAdjustedTime = () =>{
            adjustedTime += countdownTime * 2;
        };
        const startCountDown = () => {
            if (isCountingDown) return; // prevent multiple countdowns
            isCountingDown = true;
            calculateAdjustTime();
            
            const start = new Date().getTime();
            const _tick = () => {
              if (!isCountingDown){
                cancelAnimationFrame(countdownId)
                return; //isCountingDown == false means the countdown has been canceled
              }
      
              const curTime = new Date().getTime() - start;
              barLength.value = Math.floor(
                Math.max((1 - curTime / (adjustedTime * 1000)) * 100, 0)
              );
      
              if (curTime > adjustedTime  * 1010) {// timeout
                // 1.01x tolerance
                cancelAnimationFrame(countdownId)
                isCountingDown = false;
                emit('checkAnswer');
              } else {
                countdownId = requestAnimationFrame(_tick); // recursive functioncall
              }
            };
            countdownId = requestAnimationFrame(_tick); // trigger
          };
        watch(() => props.state, (newVal) => {
            if (newVal == "start"){
                startCountDown();
            }else if (newVal == "stop"){
                isCountingDown = false;
                cancelAnimationFrame(countdownId);
            }
            else if(newVal == "reset"){
                barLength.value = 100;
                isCountingDown = false;
            }
            else if(newVal == "plus"){
                plusAdjustedTime();
            }
        });
        return{
            barLength,
        };
    },
});
</script>