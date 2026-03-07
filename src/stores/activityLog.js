import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/utils/axios'

export const useActivityLogStore = defineStore('activityLog', () => {
  const logs = ref([])
  const meta = ref({})
  const loading = ref(false)

  async function fetchLogs(params = {}) {
    loading.value = true
    try {
      const { data } = await api.get('/activity-logs', { params })
      logs.value = data.data
      meta.value = data.meta ?? {}
    } finally {
      loading.value = false
    }
  }

  return { logs, meta, loading, fetchLogs }
})
