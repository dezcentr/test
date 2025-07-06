<script setup>
import { computed, defineComponent } from "vue";
import regression from "regression";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineController,
  LineElement,
  BarElement,
  CategoryScale,
  LinearScale,
} from "chart.js";
import { Bar } from "vue-chartjs";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineController,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const props = defineProps({
  labels: {
    type: Array,
    required: true,
  },
  data: {
    type: Array,
    required: true,
  },
});

const dataGraph = computed(() => {
  const result = regression.linear(
    props.data.map((val, index) => [index, val])
  );
  const trendData = result.points.map((point) => point[1]);

  return {
    labels: props.labels,
    datasets: [
      {
        backgroundColor: "#5894cd",
        data: props.data,
        barThickness: 40,
      },
      //{
      //  type: 'line',
      //  data: trendData,
      //  fill: false,
      //  borderColor: '#5894cd',
      //  borderWidth: 2,
      //  pointRadius: 0,
      //  borderDash: [5, 5]
      //}
    ],
  };
});
const options = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false,
    },
  },
  scales: {
    y: {
      beginAtZero: true,
    },
  },
};

defineComponent({
  name: "ChartsBar",
});
</script>

<template>
  <div class="charts-bar">
    <bar :data="dataGraph" :options="options" />
  </div>
</template>

<style lang="scss" scoped>
.charts-bar {
  height: 300px;
}
</style>
