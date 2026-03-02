import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const isAuthenticated = ref(false)

  function login(credentials) {
    // Simulasi login
    if (credentials.username === 'admin' && credentials.password === 'admin') {
      user.value = { name: 'Admin Keuangan', role: 'Administrator' }
      isAuthenticated.value = true
      return true
    }
    return false
  }

  function logout() {
    user.value = null
    isAuthenticated.value = false
  }

  return { user, isAuthenticated, login, logout }
})
