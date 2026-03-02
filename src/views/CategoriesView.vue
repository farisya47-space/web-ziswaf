<template>
  <div class="flex-1 p-5 md:p-8">
    <div v-if="currentView === 'list'">
      <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h3 class="font-semibold text-lg">Daftar Kategori</h3>
          <p class="text-sm text-secondary">Total {{ categories.length }} kategori</p>
        </div>
        <div class="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div class="relative w-full sm:w-64">
            <Search :size="16" class="absolute left-3 top-1/2 -translate-y-1/2 text-secondary" />
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Cari kategori..."
              class="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border focus:ring-1 focus:ring-primary outline-none text-sm"
            />
          </div>
          <button
            @click="showAddForm"
            class="bg-primary text-white rounded-xl px-5 py-2.5 font-bold hover:bg-primary-hover transition-colors flex items-center justify-center gap-2 text-sm shadow-sm shadow-primary/20"
          >
            <Plus :size="16" />
            <span>Tambah Kategori</span>
          </button>
        </div>
      </div>

      <div class="bg-white border border-border rounded-2xl overflow-hidden shadow-sm">
        <div class="overflow-x-auto">
          <table class="w-full text-left text-sm whitespace-nowrap">
            <thead class="bg-muted/50 border-b border-border">
              <tr>
                <th class="p-4 pl-6 font-semibold text-secondary">Nama Kategori</th>
                <th class="p-4 font-semibold text-secondary">Jenis Transaksi</th>
                <th class="p-4 pr-6 font-semibold text-secondary text-right">Aksi</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-border">
              <tr
                v-for="cat in paginatedCategories"
                :key="cat.id"
                class="hover:bg-muted/30 transition-colors"
              >
                <td class="p-4 pl-6">
                  <span class="font-medium text-foreground">{{ cat.name }}</span>
                </td>
                <td class="p-4">
                  <span
                    class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium"
                    :class="
                      cat.type === 'income'
                        ? 'bg-success/10 text-success'
                        : 'bg-error/10 text-error'
                    "
                  >
                    {{ cat.type === 'income' ? 'Pemasukan' : 'Pengeluaran' }}
                  </span>
                </td>
                <td class="p-4 pr-6 text-right">
                  <div class="flex items-center justify-end gap-2">
                    <button
                      @click="editCategory(cat)"
                      class="p-2 text-secondary hover:text-primary hover:bg-primary/5 rounded-lg transition-colors"
                    >
                      <Pencil :size="16" />
                    </button>
                    <button
                      @click="deleteCategory(cat.id)"
                      class="p-2 text-secondary hover:text-error hover:bg-error/5 rounded-lg transition-colors"
                    >
                      <Trash2 :size="16" />
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
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

    <div v-else class="max-w-2xl mx-auto">
      <div class="bg-white border border-border rounded-2xl shadow-sm overflow-hidden">
        <div class="p-6 md:p-8 border-b border-border">
          <h3 class="font-bold text-lg text-foreground">
            {{ currentView === 'add' ? 'Tambah' : 'Edit' }} Kategori
          </h3>
          <p class="text-sm text-secondary mt-1">
            {{
              currentView === 'add'
                ? 'Lengkapi form untuk menambahkan kategori baru'
                : 'Ubah data kategori yang sudah ada'
            }}
          </p>
        </div>
        <form @submit.prevent="saveCategory" class="p-6 md:p-8 flex flex-col gap-6">
          <div class="flex flex-col gap-2">
            <label class="text-sm font-semibold text-foreground"
              >Jenis Transaksi <span class="text-error">*</span></label
            >
            <select
              v-model="form.type"
              required
              class="w-full px-4 py-3 rounded-xl border border-border focus:ring-1 focus:ring-primary outline-none bg-white text-sm"
            >
              <option value="">Pilih Jenis</option>
              <option value="income">Pemasukan</option>
              <option value="expense">Pengeluaran</option>
            </select>
          </div>
          <div class="flex flex-col gap-2">
            <label class="text-sm font-semibold text-foreground"
              >Nama Kategori <span class="text-error">*</span></label
            >
            <input
              v-model="form.name"
              type="text"
              required
              placeholder="Contoh: Zakat, Infaq"
              class="w-full px-4 py-3 rounded-xl border border-border focus:ring-1 focus:ring-primary outline-none bg-white text-sm"
            />
          </div>
          <div class="flex items-center justify-end gap-4 mt-4 pt-6 border-t border-border">
            <button
              type="button"
              @click="currentView = 'list'"
              class="px-6 py-2.5 rounded-xl font-bold text-secondary hover:bg-muted transition-colors text-sm"
            >
              Batal
            </button>
            <button
              type="submit"
              class="px-6 py-2.5 rounded-xl font-bold bg-primary text-white hover:bg-primary-hover shadow-lg shadow-primary/20 transition-all flex items-center gap-2 text-sm"
            >
              <Save :size="16" />
              <span>{{ currentView === 'add' ? 'Simpan' : 'Update' }} Kategori</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useCategoryStore } from '@/stores/category'
import { Search, Plus, Pencil, Trash2, Save, ChevronLeft, ChevronRight } from 'lucide-vue-next'

const categoryStore = useCategoryStore()
const currentView = ref('list')
const searchQuery = ref('')
const form = ref({ id: null, name: '', type: '' })
const currentPage = ref(1)
const perPage = 10

const categories = ref([
  { id: 1, name: 'Zakat Fitrah', type: 'income' },
  { id: 2, name: 'Zakat Mal', type: 'income' },
  { id: 3, name: 'Infaq', type: 'income' },
  { id: 4, name: 'Sedekah', type: 'income' },
  { id: 5, name: 'Wakaf', type: 'income' },
  { id: 6, name: 'Bantuan Mustahik', type: 'expense' },
  { id: 7, name: 'Operasional Kantor', type: 'expense' },
  { id: 8, name: 'Biaya Haji', type: 'expense' },
  { id: 9, name: 'Utilitas', type: 'expense' },
  { id: 10, name: 'Program Dakwah', type: 'expense' },
  { id: 11, name: 'Biaya Umroh', type: 'expense' },
])

const totalPages = computed(() => Math.ceil(categories.value.length / perPage))
const paginatedCategories = computed(() => {
  const start = (currentPage.value - 1) * perPage
  return categories.value.slice(start, start + perPage)
})
const paginationInfo = computed(() => {
  const start = (currentPage.value - 1) * perPage + 1
  const end = Math.min(currentPage.value * perPage, categories.value.length)
  return `Menampilkan ${start}-${end} dari ${categories.value.length} kategori`
})

const changePage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
  }
}

const showAddForm = () => {
  form.value = { id: null, name: '', type: '' }
  currentView.value = 'add'
}

const editCategory = (cat) => {
  form.value = { ...cat }
  currentView.value = 'edit'
}

const saveCategory = () => {
  if (currentView.value === 'add') {
    categories.value.push({ ...form.value, id: Date.now() })
  } else {
    const index = categories.value.findIndex((c) => c.id === form.value.id)
    if (index !== -1) categories.value[index] = { ...form.value }
  }
  currentView.value = 'list'
}

const deleteCategory = (id) => {
  if (confirm('Apakah Anda yakin ingin menghapus kategori ini?')) {
    categories.value = categories.value.filter((c) => c.id !== id)
  }
}
</script>
