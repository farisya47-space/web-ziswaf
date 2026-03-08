<template>
  <div class="relative w-full" style="height: 300px;">
    <div v-if="loading" class="absolute inset-0 flex flex-col gap-3 justify-end pb-2 animate-pulse">
      <div class="flex items-end gap-2 h-full px-2">
        <div v-for="n in 6" :key="n" class="flex-1 bg-muted rounded-t-lg" :style="{ height: (40 + n * 8) + '%' }"></div>
      </div>
    </div>
    <canvas v-show="!loading" ref="chartCanvas"></canvas>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { Chart, registerables } from 'chart.js'

Chart.register(...registerables)

const props = defineProps({
  trendData: { type: Array, default: () => [] },
  loading: { type: Boolean, default: false }
})
const chartCanvas = ref(null)
let chartInstance = null

function buildChart() {
  if (chartInstance) chartInstance.destroy()
  chartInstance = new Chart(chartCanvas.value, {
    type: 'line',
    data: {
      labels: props.trendData.map(d => d.month),
      datasets: [{
        label: 'Penerimaan',
        data: props.trendData.map(d => d.income / 1_000_000),
        borderColor: '#30B22D', backgroundColor: 'rgba(48, 178, 45, 0.1)', tension: 0.4, fill: true
      }, {
        label: 'Pengeluaran',
        data: props.trendData.map(d => d.expense / 1_000_000),
        borderColor: '#ED6B60', backgroundColor: 'rgba(237, 107, 96, 0.1)', tension: 0.4, fill: true
      }]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: {
        legend: { position: 'bottom' },
        tooltip: { callbacks: { label: (ctx) => ctx.dataset.label + ': Rp ' + ctx.parsed.y.toFixed(1) + ' Juta' } }
      },
      scales: { y: { ticks: { callback: (v) => 'Rp ' + v + 'Jt' } } }
    }
  })
}

onMounted(() => { if (props.trendData.length) buildChart() })
watch(() => props.trendData, (val) => { if (val.length) buildChart() }, { deep: true })
</script>
