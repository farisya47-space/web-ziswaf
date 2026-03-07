<template>
  <aside
    class="flex flex-col w-[280px] h-screen bg-white border-r border-border fixed left-0 z-50 transform transition-transform"
    :class="{ '-translate-x-full lg:translate-x-0': !isMobileOpen }"
  >
    <div class="flex items-center justify-between border-b border-border h-[90px] px-5 gap-3">
      <div class="flex items-center gap-3">
        <img src="/logo-yayasan.png" alt="Logo" class="w-11 h-11 object-contain" />
        <h1 class="font-semibold text-xl">Madarijus Salikin</h1>
      </div>
      <button
        @click="closeSidebar"
        class="lg:hidden size-11 flex bg-white rounded-xl items-center justify-center ring-1 ring-border cursor-pointer"
      >
        <X :size="24" class="text-secondary" />
      </button>
    </div>

    <nav class="flex flex-col p-5 gap-6 overflow-y-auto flex-1">
      <div class="flex flex-col gap-4">
        <h3 class="font-medium text-sm text-secondary">Menu Utama</h3>
        <div class="flex flex-col gap-1">
          <router-link to="/dashboard" class="group nav-item cursor-pointer" @click="closeSidebar">
            <div
              class="flex items-center rounded-xl p-4 gap-3 hover:bg-muted transition-all group-[.router-link-active]:bg-primary/10"
            >
              <LayoutDashboard
                :size="24"
                class="text-secondary group-[.router-link-active]:text-primary group-hover:text-foreground"
              />
              <span
                class="font-medium text-secondary group-[.router-link-active]:font-semibold group-[.router-link-active]:text-primary group-hover:text-foreground"
                >Dashboard</span
              >
            </div>
          </router-link>

          <router-link to="/categories" class="group nav-item cursor-pointer" @click="closeSidebar">
            <div
              class="flex items-center rounded-xl p-4 gap-3 hover:bg-muted transition-all group-[.router-link-active]:bg-primary/10"
            >
              <Folder
                :size="24"
                class="text-secondary group-[.router-link-active]:text-primary group-hover:text-foreground"
              />
              <span
                class="font-medium text-secondary group-[.router-link-active]:font-semibold group-[.router-link-active]:text-primary group-hover:text-foreground"
                >Kategori</span
              >
            </div>
          </router-link>

          <div class="group nav-item cursor-pointer">
            <div
              class="flex items-center justify-between rounded-xl p-4 gap-3 hover:bg-muted transition-all"
              @click="toggleSubmenu"
            >
              <div class="flex items-center gap-3">
                <Receipt :size="24" class="text-secondary" />
                <span class="font-medium text-secondary">Transaksi</span>
              </div>
              <ChevronDown
                :size="16"
                class="text-secondary transition-transform"
                :class="{ 'rotate-180': submenuOpen }"
              />
            </div>
            <div
              class="submenu overflow-hidden transition-all"
              :style="{ maxHeight: submenuOpen ? '200px' : '0' }"
            >
              <router-link
                to="/income"
                class="flex items-center rounded-xl p-3 pl-14 gap-3 hover:bg-muted transition-all text-sm"
                @click="closeSidebar"
              >
                <TrendingUp :size="16" class="text-success" />
                <span class="font-medium text-secondary hover:text-foreground">Pemasukan</span>
              </router-link>
              <router-link
                to="/expense"
                class="flex items-center rounded-xl p-3 pl-14 gap-3 hover:bg-muted transition-all text-sm"
                @click="closeSidebar"
              >
                <TrendingDown :size="16" class="text-error" />
                <span class="font-medium text-secondary hover:text-foreground">Pengeluaran</span>
              </router-link>
            </div>
          </div>

          <router-link to="/reports" class="group nav-item cursor-pointer" @click="closeSidebar">
            <div
              class="flex items-center rounded-xl p-4 gap-3 hover:bg-muted transition-all group-[.router-link-active]:bg-primary/10"
            >
              <FileText
                :size="24"
                class="text-secondary group-[.router-link-active]:text-primary group-hover:text-foreground"
              />
              <span
                class="font-medium text-secondary group-[.router-link-active]:font-semibold group-[.router-link-active]:text-primary group-hover:text-foreground"
                >Laporan</span
              >
            </div>
          </router-link>

          <router-link to="/profile" class="group nav-item cursor-pointer" @click="closeSidebar">
            <div
              class="flex items-center rounded-xl p-4 gap-3 hover:bg-muted transition-all group-[.router-link-active]:bg-primary/10"
            >
              <User
                :size="24"
                class="text-secondary group-[.router-link-active]:text-primary group-hover:text-foreground"
              />
              <span
                class="font-medium text-secondary group-[.router-link-active]:font-semibold group-[.router-link-active]:text-primary group-hover:text-foreground"
                >Profil</span
              >
            </div>
          </router-link>

          <router-link
            to="/activity-logs"
            class="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-primary/5 transition-colors"
            :class="
              $route.path === '/activity-logs'
                ? 'bg-primary/10 text-primary font-semibold'
                : 'text-secondary'
            "
          >
            <History :size="24" />
            <span>Log Aktivitas</span>
          </router-link>
        </div>
      </div>
    </nav>
  </aside>
</template>

<script setup>
import { ref } from 'vue'
import {
  X,
  LayoutDashboard,
  Folder,
  Receipt,
  ChevronDown,
  TrendingUp,
  TrendingDown,
  FileText,
  User,
  History,
} from 'lucide-vue-next'

defineProps({
  isMobileOpen: Boolean,
})

const emit = defineEmits(['close'])
const submenuOpen = ref(false)

const toggleSubmenu = () => {
  submenuOpen.value = !submenuOpen.value
}

const closeSidebar = () => {
  emit('close')
}
</script>
