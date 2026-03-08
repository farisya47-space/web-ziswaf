<template>
  <div
    class="font-sans bg-linear-to-br from-muted via-white to-primary/5 min-h-screen flex items-center justify-center p-5"
  >
    <div class="w-full max-w-md">
      <div
        class="bg-white/80 backdrop-blur-xl rounded-3xl border border-border shadow-2xl overflow-hidden"
      >
        <div class="p-8 md:p-10">
          <div class="flex flex-col items-center mb-8">
            <img src="/logo-yayasan.png" alt="Logo Yayasan" class="w-20 h-20 mb-4 object-contain" />
            <h1 class="font-bold text-3xl text-foreground">Madarijus Salikin</h1>
            <p class="text-sm text-secondary mt-2">Aplikasi Laporan Keuangan</p>
          </div>

          <div
            v-if="errorMessage"
            class="mb-5 p-4 bg-error/10 border border-error/20 rounded-xl flex items-center gap-3"
          >
            <AlertCircle :size="20" class="text-error shrink-0" />
            <p class="text-sm text-error font-medium">{{ errorMessage }}</p>
          </div>

          <form
            @submit.prevent="handleLogin"
            class="flex flex-col gap-5"
            :class="{ 'animate-shake': isShaking }"
          >
            <div class="flex flex-col gap-2">
              <label for="username" class="text-sm font-semibold text-foreground">Username</label>
              <div class="relative">
                <User :size="20" class="absolute left-4 top-1/2 -translate-y-1/2 text-secondary" />
                <input
                  v-model="form.username"
                  id="username"
                  type="text"
                  placeholder="Masukkan username"
                  autocomplete="username"
                  required
                  class="w-full pl-12 pr-4 py-3 rounded-xl border border-border focus:ring-2 focus:ring-primary focus:border-primary outline-none bg-white transition-all text-sm"
                />
              </div>
            </div>

            <div class="flex flex-col gap-2">
              <label for="password" class="text-sm font-semibold text-foreground">Password</label>
              <div class="relative">
                <Lock :size="20" class="absolute left-4 top-1/2 -translate-y-1/2 text-secondary" />
                <input
                  v-model="form.password"
                  id="password"
                  :type="showPassword ? 'text' : 'password'"
                  placeholder="Masukkan password"
                  autocomplete="current-password"
                  required
                  class="w-full pl-12 pr-12 py-3 rounded-xl border border-border focus:ring-2 focus:ring-primary focus:border-primary outline-none bg-white transition-all text-sm"
                />
                <button
                  type="button"
                  @click="showPassword = !showPassword"
                  class="absolute right-4 top-1/2 -translate-y-1/2 text-secondary hover:text-foreground transition-colors"
                >
                  <Eye v-if="!showPassword" :size="20" />
                  <EyeOff v-else :size="20" />
                </button>
              </div>
            </div>

            <button
              type="submit"
              :disabled="isLoading"
              class="w-full bg-linear-to-r from-primary to-primary-hover text-white rounded-xl py-3.5 font-bold hover:shadow-xl hover:shadow-primary/30 transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer mt-2 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              <span>{{ isLoading ? 'Memproses...' : isSuccess ? 'Berhasil!' : 'Masuk' }}</span>
              <CheckCircle v-if="isSuccess" :size="20" />
              <LogIn v-else-if="!isLoading" :size="20" />
              <div
                v-else
                class="size-5 border-2 border-white/30 border-t-white rounded-full animate-spin"
              ></div>
            </button>
          </form>
        </div>
      </div>

      <p class="text-center text-sm text-secondary mt-6">
        © 2026 Madarijus Salikin. All rights reserved.
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { Eye, EyeOff, User, Lock, AlertCircle, LogIn, CheckCircle } from 'lucide-vue-next'

const router = useRouter()
const authStore = useAuthStore()
const form = ref({ username: '', password: '' })
const showPassword = ref(false)
const errorMessage = ref('')
const isLoading = ref(false)
const isSuccess = ref(false)
const isShaking = ref(false)

const route = useRoute()

onMounted(() => {
  if (route.query.reason === 'idle') {
    errorMessage.value = 'Sesi Anda telah berakhir karena tidak ada aktivitas selama 90 menit'
  }
})

async function handleLogin() {
  errorMessage.value = ''

  if (!form.value.username || !form.value.password) {
    errorMessage.value = 'Username dan password harus diisi'
    return
  }

  isLoading.value = true

  try {
    await authStore.login(form.value)

    isSuccess.value = true
    isLoading.value = false

    setTimeout(() => router.push('/dashboard'), 500)
  } catch (error) {
    console.log('Error status:', error.response?.status)
    console.log('Error message:', error.message)
    console.log('Full error:', error)
    isLoading.value = false
    isShaking.value = true
    setTimeout(() => (isShaking.value = false), 400)

    if (error.response?.status === 401) {
      errorMessage.value = 'Username atau password salah'
    } else if (error.response?.status === 422) {
      const errors = error.response.data.errors
      const firstError = Object.values(errors)[0][0]
      errorMessage.value = firstError
    } else {
      errorMessage.value = 'Terjadi kesalahan, coba lagi'
    }
  }
}
</script>

<style scoped>
@keyframes shake {
  0%,
  100% {
    transform: translateX(0);
  }
  25% {
    transform: translateX(-10px);
  }
  75% {
    transform: translateX(10px);
  }
}
.animate-shake {
  animation: shake 0.4s;
}
</style>
