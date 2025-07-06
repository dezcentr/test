<script setup>
import {computed, defineComponent, ref} from "vue";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import { Doughnut } from 'vue-chartjs'

ChartJS.register(ArcElement, Tooltip, Legend);

const props = defineProps({
  backgroundColor: {
    type: Array,
    required: true
  },
  labels: {
    type: Array,
    required: true
  },
  data: {
    type: Array,
    required: true
  }
})

const dataGraph = computed(() => ({
  labels: props.labels,
  datasets: [
    {
      backgroundColor: props.backgroundColor,
      data: props.data
    }
  ]
}));
const options = {
  responsive: true,
  maintainAspectRatio: false,
  spacing: 5
}

defineComponent({
  name: "ChartsDoughnut"
})
</script>

<template>
  <div class="charts-doughnut">
    <doughnut
      :data="dataGraph"
      :options="options"
    />
  </div>
</template>

<style lang="scss" scoped>
.charts-doughnut {
  height: 300px;
}
</style>
