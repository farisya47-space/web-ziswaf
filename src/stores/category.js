import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useCategoryStore = defineStore('category', () => {
  const categories = ref([
    { id: 1, name: 'Zakat Fitrah', type: 'income' },
    { id: 2, name: 'Zakat Mal', type: 'income' },
    { id: 3, name: 'Infaq', type: 'income' },
    { id: 4, name: 'Sedekah', type: 'income' },
    { id: 5, name: 'Wakaf', type: 'income' },
    { id: 6, name: 'Bantuan Mustahik', type: 'expense' },
    { id: 7, name: 'Operasional Kantor', type: 'expense' },
    { id: 8, name: 'Biaya Haji', type: 'expense' },
    { id: 9, name: 'Biaya Umroh', type: 'expense' },
    { id: 10, name: 'Utilitas', type: 'expense' },
    { id: 11, name: 'Program Dakwah', type: 'expense' },
  ])

  const addCategory = (category) => {
    categories.value.push({ ...category, id: Date.now() })
  }

  const updateCategory = (category) => {
    const index = categories.value.findIndex(c => c.id === category.id)
    if (index !== -1) categories.value[index] = category
  }

  const deleteCategory = (id) => {
    categories.value = categories.value.filter(c => c.id !== id)
  }

  return { categories, addCategory, updateCategory, deleteCategory }
})
