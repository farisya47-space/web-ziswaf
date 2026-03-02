<template>
  <div class="flex h-screen bg-muted overflow-hidden">
    <div
      v-if="sidebarOpen"
      @click="closeSidebar"
      class="fixed inset-0 bg-black/80 z-40 lg:hidden"
    ></div>
    <Sidebar :isMobileOpen="sidebarOpen" @close="closeSidebar" />
    <main class="flex-1 lg:ml-[280px] flex flex-col bg-white min-h-screen">
      <Header :title="pageTitle" @toggleSidebar="toggleSidebar" />
      <div class="flex-1 overflow-y-auto">
        <slot />
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import Sidebar from '@/components/Sidebar.vue'
import Header from '@/components/Header.vue'

const route = useRoute()
const sidebarOpen = ref(false)

const pageTitle = computed(() => {
  const titles = {
    '/dashboard': 'Dashboard Keuangan',
    '/categories': 'Kelola Kategori',
    '/income': 'Transaksi Pemasukan',
    '/expense': 'Transaksi Pengeluaran',
    '/reports': 'Laporan Keuangan',
    '/profile': 'Profil Pengguna',
  }
  return titles[route.path] || 'Dashboard'
})

const toggleSidebar = () => {
  sidebarOpen.value = !sidebarOpen.value
}

const closeSidebar = () => {
  sidebarOpen.value = false
}
</script>
