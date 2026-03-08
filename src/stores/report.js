import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/utils/axios'

export const useReportStore = defineStore('report', () => {
  const report = ref(null)
  const loading = ref(false)

  async function generateReport(startDate, endDate) {
    loading.value = true
    try {
      const { data } = await api.post('/reports/generate', {
        start_date: startDate,
        end_date: endDate,
      })
      report.value = data.data
    } catch (error) {
      // Re-throw error agar bisa ditangkap di component
      throw error
    } finally {
      loading.value = false
    }
  }

  // async function logExport(period) {
  //   try {
  //     await api.post('/reports/log-export', { period })
  //   } catch (error) {
  //     console.error('Failed to log export:', error)
  //   }
  // }

  return { report, loading, generateReport }
})
