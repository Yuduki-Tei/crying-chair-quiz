<template>
    <div class="progress mb-1 justify-content-start" style="height: 3px">
      <div
        :class="{
          'progress-bar bar-high': barLength >= 60,
          'progress-bar bar-medium': 60 > barLength && barLength >= 35,
          'progress-bar bar-low': 35 > barLength && barLength >= 15,
          'progress-bar bar-danger': barLength < 15,
        }"
        role="progressbar"
        :style="{ width: barLength + '%' }"
      ></div>
    </div>
</template>

<script lang = "ts">
import { computed, defineComponent } from 'vue';
export default defineComponent({
    name: "CountdownBar",
    props:{
        barLength: {type: Number, default: 100},
    },
    setup(props) {
        const barLength = computed(() => props.barLength)
        return{
            barLength,
        };
    },
});
</script>