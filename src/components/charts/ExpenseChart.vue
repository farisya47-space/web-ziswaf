<template>
  <div class="relative flex items-center justify-center" style="height: 200px; position: relative;">
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
    type: 'doughnut',
    data: {
      labels: ['Mustahik', 'Operasional', 'Program', 'Lainnya'],
      datasets: [{
        data: [20.9, 18.3, 7.8, 5.3],
        backgroundColor: ['#004b72', '#FED71F', '#ED6B60', '#30B22D']
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: (context) => {
              const total = context.dataset.data.reduce((a, b) => a + b, 0)
              const percentage = ((context.parsed / total) * 100).toFixed(1)
              return context.label + ': Rp ' + context.parsed + ' Juta (' + percentage + '%)'
            }
          }
        }
      }
    }
  })
})
</script>
