<template>
    <i :class="{
          'text-correct': total >= 800,
          'text-normal': 800 > total && total >= 400,
          'text-incorrect': 400 > total && total >= 200,
          'text-low': total < 200}">{{displayPoint}}</i>
</template>

<script lang="ts">
import { defineComponent, computed, ref, watch, onMounted } from 'vue';

export default defineComponent({
    name: "NumberIncrement",
    props:{
        total: { type: Number, default: 0 },
        duration: { type: Number, default: 3000 },
        reset: { type: Boolean, default: false },
    },
    setup(props) {
        const total = computed(() => props.total)
        const displayPoint = ref(0);
        const duration = props.duration;

        const startCounting = (targetValue: number) => {
            let count = displayPoint.value;
            const increment = (targetValue - count) / (duration / 100);

            const updateCounter = () => {
                count += increment;
                if (count < total.value) {
                    displayPoint.value = Math.floor(count);
                    requestAnimationFrame(updateCounter);
                } else {
                    displayPoint.value = total.value;
                }
            };

            updateCounter();
        };

        onMounted(() =>{
            if (props.reset) {
                displayPoint.value = 0;
            };
            startCounting(props.total);
        })

        watch(total, (newValue: any) => {
            startCounting(newValue);
        });

        return {displayPoint}
    },
})
</script>