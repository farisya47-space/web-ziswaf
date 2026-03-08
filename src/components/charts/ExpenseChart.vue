<template>
  <div class="relative flex items-center justify-center" style="height: 200px;">
    <div v-if="loading" class="absolute inset-0 flex items-center justify-center animate-pulse">
      <div class="size-40 rounded-full border-24 border-muted"></div>
    </div>
    <canvas v-show="!loading" ref="chartCanvas"></canvas>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { Chart, registerables } from 'chart.js'

Chart.register(...registerables)

const props = defineProps({
  expenseData: { type: Array, default: () => [] },
  loading: { type: Boolean, default: false }
})
const chartCanvas = ref(null)
let chartInstance = null

function buildChart() {
  if (chartInstance) chartInstance.destroy()
  chartInstance = new Chart(chartCanvas.value, {
    type: 'doughnut',
    data: {
      labels: props.expenseData.map(d => d.category),
      datasets: [{ data: props.expenseData.map(d => d.amount / 1_000_000), backgroundColor: ['#004b72', '#FED71F', '#ED6B60', '#30B22D'] }]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: { callbacks: { label: (ctx) => { const total = ctx.dataset.data.reduce((a, b) => a + b, 0); return ctx.label + ': Rp ' + ctx.parsed.toFixed(1) + ' Juta (' + ((ctx.parsed / total) * 100).toFixed(1) + '%)' } } }
      }
    }
  })
}

onMounted(() => { if (props.expenseData.length) buildChart() })
watch(() => props.expenseData, (val) => { if (val.length) buildChart() }, { deep: true })
</script>
