import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '@/utils/axios'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(JSON.parse(localStorage.getItem('user')) || null)
  const token = ref(localStorage.getItem('token') || null)

  const isLoggedIn = computed(() => !!token.value)

  async function login(credentials) {
    const response = await api.post('/login', credentials)
    token.value = response.data.data.access_token
    localStorage.setItem('token', token.value)
    await fetchProfile()
    return true
  }

  async function fetchProfile() {
    const response = await api.get('/profile')
    // console.log('profile response:', response.data) // check this
    user.value = response.data.user ?? response.data.data ?? response.data
    localStorage.setItem('user', JSON.stringify(user.value))
  }

  async function logout() {
    try {
      await api.post('/logout')
    } finally {
      user.value = null
      token.value = null
      localStorage.removeItem('token')
      localStorage.removeItem('user')
    }
  }

  return { user, token, isLoggedIn, login, logout, fetchProfile }
})
