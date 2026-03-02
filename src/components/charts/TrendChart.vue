<template>
  <div class="w-full" style="height: 300px; position: relative;">
    <canvas ref="chartCanvas"></canvas>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { Chart, registerables } from 'chart.js'

Chart.register(...registerables)

const chartCanvas = ref(null)

onMounted(() => {
  new Chart(chartCanvas.value, {
    type: 'line',
    data: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun'],
      datasets: [{
        label: 'Penerimaan',
        data: [65, 72, 68, 78, 82, 85.5],
        borderColor: '#30B22D',
        backgroundColor: 'rgba(48, 178, 45, 0.1)',
        tension: 0.4,
        fill: true
      }, {
        label: 'Pengeluaran',
        data: [45, 48, 52, 49, 55, 52.3],
        borderColor: '#ED6B60',
        backgroundColor: 'rgba(237, 107, 96, 0.1)',
        tension: 0.4,
        fill: true
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: 'bottom' },
        tooltip: {
          callbacks: {
            label: (context) => context.dataset.label + ': Rp ' + context.parsed.y.toFixed(1) + ' Juta'
          }
        }
      },
      scales: {
        y: {
          ticks: {
            callback: (value) => 'Rp ' + value + 'Jt'
          }
        }
      }
    }
  })
})
</script>
