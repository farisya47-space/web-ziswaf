import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/utils/axios'

export const useCategoryStore = defineStore('category', () => {
  const categories = ref([])
  const meta = ref({})
  const loading = ref(false)

  async function fetchCategories(params = {}) {
    loading.value = true
    try {
      const { data } = await api.get('/categories', { params })
      categories.value = data.data
      meta.value = data.meta
    } finally {
      loading.value = false
    }
  }

  async function createCategory(payload) {
    const { data } = await api.post('/categories', payload)
    return data
  }

  async function updateCategory(id, payload) {
    const { data } = await api.put(`/categories/${id}`, payload)
    return data
  }

  async function deleteCategory(id) {
    await api.delete(`/categories/${id}`)
  }

  return {
    categories,
    meta,
    loading,
    fetchCategories,
    createCategory,
    updateCategory,
    deleteCategory,
  }
})
