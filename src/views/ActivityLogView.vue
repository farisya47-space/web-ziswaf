<template>
  <div class="flex-1 p-5 md:p-8">
    <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
      <div>
        <h3 class="font-semibold text-lg">Log Aktivitas User</h3>
        <p class="text-sm text-secondary">Riwayat aktivitas pengguna di sistem</p>
      </div>
      <div class="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
        <select
          v-model="filterModule"
          class="px-4 py-2.5 rounded-xl border border-border focus:ring-1 focus:ring-primary outline-none text-sm"
        >
          <option value="">Semua Modul</option>
          <option value="Auth">Autentikasi</option>
          <option value="Category">Kategori</option>
          <option value="Income">Pemasukan</option>
          <option value="Expense">Pengeluaran</option>
        </select>
        <select
          v-model="filterAction"
          class="px-4 py-2.5 rounded-xl border border-border focus:ring-1 focus:ring-primary outline-none text-sm"
        >
          <option value="">Semua Aksi</option>
          <option value="login">Login</option>
          <option value="logout">Logout</option>
          <option value="created">Tambah</option>
          <option value="updated">Ubah</option>
          <option value="deleted">Hapus</option>
        </select>
      </div>
    </div>

    <div class="bg-white border border-border rounded-2xl overflow-hidden shadow-sm">
      <div class="hidden sm:block overflow-x-auto">
        <table class="w-full text-left text-sm whitespace-nowrap">
          <thead class="bg-muted/50 border-b border-border">
            <tr>
              <th class="p-4 pl-6 font-semibold text-secondary">Waktu</th>
              <th class="p-4 font-semibold text-secondary">User</th>
              <th class="p-4 font-semibold text-secondary">Aksi</th>
              <th class="p-4 font-semibold text-secondary">Modul</th>
              <th class="p-4 pr-6 font-semibold text-secondary">Deskripsi</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-border">
            <template v-if="loading && !logs.length">
              <tr v-for="n in 5" :key="n" class="animate-pulse">
                <td class="p-4 pl-6"><div class="h-4 bg-muted rounded w-28"></div></td>
                <td class="p-4"><div class="h-4 bg-muted rounded w-24"></div></td>
                <td class="p-4"><div class="h-6 bg-muted rounded-full w-16"></div></td>
                <td class="p-4"><div class="h-6 bg-muted rounded-full w-20"></div></td>
                <td class="p-4 pr-6"><div class="h-4 bg-muted rounded w-48"></div></td>
              </tr>
            </template>
            <tr v-else-if="!logs.length">
              <td colspan="5" class="p-8 text-center text-secondary text-sm">
                Tidak ada log aktivitas
              </td>
            </tr>
            <tr
              v-for="log in logs"
              :key="log.id"
              class="hover:bg-muted/30 transition-colors"
              :class="loading ? 'opacity-50' : ''"
            >
              <td class="p-4 pl-6 text-secondary">{{ formatDate(log.created_at) }}</td>
              <td class="p-4">
                <span class="font-medium">{{ log.user?.name ?? '-' }}</span>
              </td>
              <td class="p-4">
                <span
                  class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium"
                  :class="getActionClass(log.action)"
                >
                  {{ getActionText(log.action) }}
                </span>
              </td>
              <td class="p-4">
                <span
                  class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary"
                >
                  {{ getModuleText(log.module) }}
                </span>
              </td>
              <td class="p-4 pr-6 text-secondary">{{ log.description }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <!-- Mobile Card List -->
      <div class="sm:hidden divide-y divide-border">
        <template v-if="loading && !logs.length">
          <div v-for="n in 5" :key="n" class="p-4 animate-pulse flex flex-col gap-2">
            <div class="h-4 bg-muted rounded w-28"></div>
            <div class="h-4 bg-muted rounded w-24"></div>
            <div class="h-4 bg-muted rounded w-32"></div>
          </div>
        </template>
        <div v-else-if="!logs.length" class="p-8 text-center text-secondary text-sm">
          Tidak ada log aktivitas
        </div>
        <div
          v-for="log in logs"
          :key="log.id"
          class="p-4 flex flex-col gap-2"
          :class="loading ? 'opacity-50' : ''"
        >
          <div class="flex items-center justify-between gap-2">
            <span class="font-medium text-sm">{{ log.user?.name ?? '-' }}</span>
            <span class="text-xs text-secondary">{{ formatDate(log.created_at) }}</span>
          </div>
          <div class="flex items-center gap-2 flex-wrap">
            <span
              class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium"
              :class="getActionClass(log.action)"
            >
              {{ getActionText(log.action) }}
            </span>
            <span class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
              {{ getModuleText(log.module) }}
            </span>
          </div>
          <p class="text-xs text-secondary">{{ log.description }}</p>
        </div>
      </div>
      <div
        class="p-4 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-secondary"
      >
        <p>{{ paginationInfo }}</p>
        <div class="flex items-center gap-2">
          <button
            @click="changePage(currentPage - 1)"
            :disabled="currentPage === 1"
            class="p-2 border border-border rounded-lg hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft :size="16" />
          </button>
          <button
            v-for="page in totalPages"
            :key="page"
            @click="changePage(page)"
            :class="page === currentPage ? 'bg-primary text-white' : 'hover:bg-muted'"
            class="px-3 py-1.5 rounded-lg font-medium"
          >
            {{ page }}
          </button>
          <button
            @click="changePage(currentPage + 1)"
            :disabled="currentPage === totalPages"
            class="p-2 border border-border rounded-lg hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronRight :size="16" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useActivityLogStore } from '@/stores/activityLog'
import { ChevronLeft, ChevronRight } from 'lucide-vue-next'

const store = useActivityLogStore()
const { logs, meta, loading } = storeToRefs(store)

const filterModule = ref('')
const filterAction = ref('')
const currentPage = ref(1)
const perPage = 10

const totalPages = computed(() => meta.value?.last_page ?? 1)
const paginationInfo = computed(() => {
  const { from, to, total } = meta.value ?? {}
  return from ? `Menampilkan ${from}-${to} dari ${total} log` : ''
})

async function loadLogs() {
  await store.fetchLogs({
    page: currentPage.value,
    per_page: perPage,
    module: filterModule.value || undefined,
    action: filterAction.value || undefined,
  })
}

onMounted(() => loadLogs())

const stopWatch = watch([filterModule, filterAction], () => {
  currentPage.value = 1
  loadLogs()
})
onUnmounted(() => stopWatch())

function changePage(page) {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
    loadLogs()
  }
}

const formatDate = (date) =>
  new Date(date).toLocaleString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })

const getActionClass = (action) =>
  ({
    login: 'bg-success/10 text-success',
    logout: 'bg-secondary/10 text-secondary',
    created: 'bg-primary/10 text-primary',
    updated: 'bg-warning/10 text-warning',
    deleted: 'bg-error/10 text-error',
  })[action] || 'bg-muted text-secondary'

const getActionText = (action) =>
  ({
    login: 'Login',
    logout: 'Logout',
    created: 'Tambah',
    updated: 'Ubah',
    deleted: 'Hapus',
  })[action] || action

const getModuleText = (module) => {
  if (!module) return '-'
  const name = module.split('\\').pop()
  return (
    { Auth: 'Autentikasi', Category: 'Kategori', Income: 'Pemasukan', Expense: 'Pengeluaran' }[
      name
    ] || name
  )
}
</script>
