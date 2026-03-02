import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useTransactionStore = defineStore('transaction', () => {
  const incomes = ref([])
  const expenses = ref([])

  function generateTrxNumber(type) {
    const timestamp = Date.now().toString().slice(-6)
    const random = Math.floor(Math.random() * 1000)
      .toString()
      .padStart(3, '0')
    return `${type}${timestamp}${random}`
  }

  function addIncome(data) {
    incomes.value.push({ ...data, id: generateTrxNumber('IN') })
  }

  function addExpense(data) {
    expenses.value.push({ ...data, id: generateTrxNumber('OUT') })
  }

  return { incomes, expenses, addIncome, addExpense, generateTrxNumber }
})
