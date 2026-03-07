import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/utils/axios'

export const useTransactionStore = defineStore('transaction', () => {
  const transactions = ref([])
  const meta = ref({})
  const loading = ref(false)

  async function fetchTransactions(type, params = {}) {
    loading.value = true
    transactions.value = []
    meta.value = {}
    try {
      const { data } = await api.get(`/${type}`, { params })
      transactions.value = data.data
      meta.value = data.meta ?? {}
    } finally {
      loading.value = false
    }
  }

  async function createTransaction(type, payload) {
    const { data } = await api.post(`/${type}`, payload)
    return data
  }

  async function updateTransaction(type, id, payload) {
    const { data } = await api.put(`/${type}/${id}`, payload)
    return data
  }

  async function deleteTransaction(type, id) {
    await api.delete(`/${type}/${id}`)
  }

  return { transactions, meta, loading, fetchTransactions, createTransaction, updateTransaction, deleteTransaction }
})
