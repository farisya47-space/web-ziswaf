<template>
  <div
    class="flex items-center justify-between h-22.5 border-b border-border bg-white px-5 md:px-8"
  >
    <button
      @click="toggleSidebar"
      class="lg:hidden size-11 flex items-center justify-center rounded-xl ring-1 ring-border cursor-pointer"
    >
      <Menu :size="24" />
    </button>
    <h2 class="hidden lg:block font-bold text-2xl">{{ title }}</h2>
    <div class="flex items-center gap-3">
      <!-- Mobile avatar button -->
      <div class="relative md:hidden">
        <button
          @click="toggleUserMenu"
          class="size-10 rounded-full border border-border cursor-pointer"
        >
          <img :src="user.avatar" class="size-10 rounded-full object-cover" />
        </button>
        <div
          v-show="userMenuOpen"
          class="absolute right-0 top-12 w-48 bg-white border border-border rounded-xl shadow-lg overflow-hidden z-50"
        >
          <div class="px-4 py-3 border-b border-border">
            <p class="font-semibold text-sm">{{ user.name }}</p>
            <p class="text-secondary text-xs">{{ user.role }}</p>
          </div>
          <a
            @click="logout"
            class="flex items-center gap-3 px-4 py-3 hover:bg-muted transition-colors text-sm cursor-pointer"
          >
            <LogOut :size="16" class="text-error" />
            <span class="font-medium text-error">Logout</span>
          </a>
        </div>
      </div>
      <div class="hidden md:flex items-center gap-3 pl-3 border-l border-border relative">
        <div class="text-right">
          <p class="font-semibold text-sm">{{ user.name }}</p>
          <p class="text-secondary text-xs">{{ user.role }}</p>
        </div>
        <div class="relative">
          <button
            @click="toggleUserMenu"
            class="size-11 rounded-full object-cover border border-border cursor-pointer"
          >
            <img :src="user.avatar" class="size-11 rounded-full object-cover" />
          </button>
          <div
            v-show="userMenuOpen"
            class="absolute right-0 top-14 w-48 bg-white border border-border rounded-xl shadow-lg overflow-hidden z-50"
          >
            <a
              @click="logout"
              class="flex items-center gap-3 px-4 py-3 hover:bg-muted transition-colors text-sm cursor-pointer"
            >
              <LogOut :size="16" class="text-error" />
              <span class="font-medium text-error">Logout</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { Menu, LogOut } from 'lucide-vue-next'

defineProps({
  title: {
    type: String,
    default: 'Dashboard',
  },
})

const emit = defineEmits(['toggleSidebar'])
const router = useRouter()
const authStore = useAuthStore()

const userMenuOpen = ref(false)
const user = ref({
  name: 'Admin Keuangan',
  role: 'Administrator',
  avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&h=100&fit=crop',
})

const toggleSidebar = () => {
  emit('toggleSidebar')
}

const toggleUserMenu = () => {
  userMenuOpen.value = !userMenuOpen.value
}

const logout = async () => {
  await authStore.logout()
  router.push('/login')
}

const handleClickOutside = (event) => {
  if (userMenuOpen.value && !event.target.closest('.relative')) {
    userMenuOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>
