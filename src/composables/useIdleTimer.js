import { onMounted, onUnmounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

const IDLE_TIMEOUT = 90 * 60 * 1000
const EVENTS = ['mousemove', 'keydown', 'mousedown', 'touchstart', 'scroll']

export function useIdleTimer() {
  const authStore = useAuthStore()
  const router = useRouter()
  let timer = null

  function reset() {
    clearTimeout(timer)
    timer = setTimeout(async () => {
      if (authStore.isLoggedIn) {
        await authStore.logout()
        router.push({ path: '/login', query: { reason: 'idle' } })
      }
    }, IDLE_TIMEOUT)
  }

  onMounted(() => {
    reset()
    EVENTS.forEach(e => window.addEventListener(e, reset, { passive: true }))
  })

  onUnmounted(() => {
    clearTimeout(timer)
    EVENTS.forEach(e => window.removeEventListener(e, reset))
  })
}
