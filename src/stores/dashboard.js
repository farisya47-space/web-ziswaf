import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/utils/axios'

export const useDashboardStore = defineStore('dashboard', () => {
  const data = ref(null)
  const loading = ref(false)

  async function fetchDashboard(period = '6months') {
    loading.value = true
    try {
      const res = await api.get(`/dashboard?period=${period}`)
      data.value = res.data.data
    } finally {
      loading.value = false
    }
  }

  return { data, loading, fetchDashboard }
})
