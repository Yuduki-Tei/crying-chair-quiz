<template>
  <Radar :data="data" :options="option"/>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import type { ChartData, ChartOptions } from 'chart.js';
import { Radar } from 'vue-chartjs';
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  PointElement,
  RadialLinearScale,
  Filler,
  LineElement,
} from 'chart.js'
ChartJS.register(CategoryScale, LinearScale, BarElement,PointElement ,RadialLinearScale, LineElement, Filler, Title, Tooltip, Legend)
ChartJS.defaults.font.family = "Inter, system-ui, Avenir, Helvetica, Arial, sans-serif";
export default defineComponent({
    name: "RadarChart",
    components:{ Radar },
    props:{
      correctRates: {type: Array<number>, default: [0,0,0,0,0,0,0,0,0,0]},
      questionCounts: {type: Array<string>,
        default: () => (['0/0', '0/0', '0/0', '0/0', '0/0', '0/0', '0/0', '0/0', '0/0', '0/0'])},
    },
    setup(props){
      const data:ChartData<'radar'> = {
        labels: [
          '文學',
          '理科',
          '地理',
          '社會',
          '生活',
          '歷史',
          '語言',
          '運動',
          '文化',
          '娛樂'
        ],
        datasets: [
          {
            label: '正解率',
            backgroundColor: 'rgba(3, 147, 147, 0.1)',
            borderColor: '#039393',
            pointBackgroundColor: '#039393',
            data: props.correctRates,
          },
        ]
      }
      const option:ChartOptions<'radar'> = {
        devicePixelRatio: 4,
        responsive:  true,
        maintainAspectRatio: true,
        scales: {
          r: {        
            suggestedMin: 0,
            suggestedMax: Math.max(Math.floor(Math.max(...props.correctRates)/10)*10, 50),
            grid: {
              color: '#156160'
            },
            angleLines:{
              color: '#156160',
            },
            pointLabels:{
              color: 'rgba(255, 255, 255, 0.87)',
              font: {
                size: 16
              },
            },
            ticks:{
              stepSize: 25,
              color: 'rgba(255, 255, 255, 0.87)',
              backdropColor: 'rgba(0, 0, 0, 0)',
              font: {
                size: 12
              },
            },
          },
        },
        interaction: {
          mode: 'nearest',
          intersect: false,
        },
        plugins:{
          legend:{
            display:false,
          },
          title: {
            color: 'rgba(255, 255, 255, 0.87)',
            display: true,
            text: "分類正解率",
            font: {
              size: 20
            },
          },
          
          tooltip: {
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            titleColor: 'rgba(255, 255, 255, 0.87)',
            bodyColor: 'rgba(255, 255, 255, 0.87)',
            position: 'nearest',
            displayColors: false,
            callbacks: {
              title: function(context) {
                const value = context[0].raw;
                return `正解率：${value} %`;
              },
              label: function(context) {
                const index = context.dataIndex;
                const title = props.questionCounts[index];
                return `正解/已答：${title || ''}`;
              },
            },
          },
        },
      };
    return {data, option}
  },
});
</script>