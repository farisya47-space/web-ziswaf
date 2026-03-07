<template>
  <div class="flex-1 p-5 md:p-8">
    <Transition
      enter-from-class="opacity-0 translate-y-2"
      enter-active-class="transition-all duration-300"
      leave-to-class="opacity-0 translate-y-2"
      leave-active-class="transition-all duration-300"
    >
      <div
        v-if="successMessage"
        class="fixed bottom-6 right-6 z-50 bg-success text-white px-5 py-3 rounded-xl shadow-lg text-sm font-medium flex items-center gap-2"
      >
        <CheckCircle :size="16" />
        {{ successMessage }}
      </div>
    </Transition>
    <div v-if="currentView === 'list'">
      <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h3 class="font-semibold text-lg">Daftar Kategori</h3>
          <p class="text-sm text-secondary">Total {{ meta.total ?? 0 }} kategori</p>
        </div>
        <div class="flex gap-3 w-full md:w-auto">
          <div class="relative flex-1 md:w-64 md:flex-none">
            <div class="absolute left-3 top-1/2 -translate-y-1/2 text-secondary">
              <svg v-if="loading" class="animate-spin size-4" fill="none" viewBox="0 0 24 24">
                <circle
                  class="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  stroke-width="4"
                />
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
              </svg>
              <Search v-else :size="16" />
            </div>
            <input
              v-model="searchQuery"
              @input="onSearch"
              type="text"
              placeholder="Cari kategori..."
              class="w-full pl-10 pr-8 py-2.5 rounded-xl border border-border focus:ring-1 focus:ring-primary outline-none text-sm"
            />
            <button
              v-if="searchQuery"
              @click="searchQuery = ''; onSearch()"
              class="absolute right-3 top-1/2 -translate-y-1/2 text-secondary hover:text-foreground"
            >
              <X :size="14" />
            </button>
          </div>
          <button
            @click="showAddForm"
            class="bg-primary text-white rounded-xl px-4 py-2.5 font-bold hover:bg-primary-hover transition-colors flex items-center justify-center gap-2 text-sm shadow-sm shadow-primary/20 shrink-0"
          >
            <Plus :size="16" />
            <span class="hidden sm:inline">Tambah Kategori</span>
            <span class="sm:hidden">Tambah</span>
          </button>
        </div>
      </div>

      <div class="bg-white border border-border rounded-2xl overflow-hidden shadow-sm">
        <!-- Desktop Table -->
        <div class="hidden sm:block overflow-x-auto">
          <table class="w-full text-left text-sm whitespace-nowrap">
            <thead class="bg-muted/50 border-b border-border">
              <tr>
                <th class="p-4 pl-6 font-semibold text-secondary">Nama Kategori</th>
                <th class="p-4 font-semibold text-secondary">Jenis Transaksi</th>
                <th class="p-4 pr-6 font-semibold text-secondary text-right">Aksi</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-border">
              <template v-if="loading && !displayCategories.length">
                <tr v-for="n in 5" :key="n" class="animate-pulse">
                  <td class="p-4 pl-6"><div class="h-4 bg-muted rounded w-32"></div></td>
                  <td class="p-4"><div class="h-6 bg-muted rounded-full w-20"></div></td>
                  <td class="p-4 pr-6 flex justify-end gap-2">
                    <div class="h-8 w-8 bg-muted rounded-lg"></div>
                    <div class="h-8 w-8 bg-muted rounded-lg"></div>
                  </td>
                </tr>
              </template>
              <tr v-else-if="!displayCategories.length">
                <td colspan="3" class="p-8 text-center text-secondary text-sm">
                  {{
                    searchQuery
                      ? `Tidak ada hasil untuk "${searchQuery}"`
                      : 'Tidak ada data kategori'
                  }}
                </td>
              </tr>
              <tr
                v-for="cat in displayCategories"
                :key="cat.id"
                class="hover:bg-muted/30 transition-all"
                :class="loading ? 'opacity-50' : 'opacity-100'"
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
                  <div v-if="deletingId === cat.id" class="flex items-center justify-end gap-2">
                    <span class="text-xs text-secondary">Hapus?</span>
                    <button
                      @click="confirmDelete(cat.id)"
                      class="px-2.5 py-1 text-xs font-medium bg-error text-white rounded-lg hover:bg-error/90"
                    >
                      Ya
                    </button>
                    <button
                      @click="deletingId = null"
                      class="px-2.5 py-1 text-xs font-medium bg-muted text-secondary rounded-lg hover:bg-border"
                    >
                      Batal
                    </button>
                  </div>
                  <div v-else class="flex items-center justify-end gap-2">
                    <button
                      @click="editCategory(cat)"
                      class="p-2 text-secondary hover:text-primary hover:bg-primary/5 rounded-lg transition-colors"
                    >
                      <Pencil :size="16" />
                    </button>
                    <button
                      @click="deletingId = cat.id"
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

        <!-- Mobile Card List -->
        <div class="sm:hidden divide-y divide-border">
          <template v-if="loading && !displayCategories.length">
            <div
              v-for="n in 5"
              :key="n"
              class="p-4 animate-pulse flex items-center justify-between"
            >
              <div class="flex flex-col gap-2">
                <div class="h-4 bg-muted rounded w-32"></div>
                <div class="h-5 bg-muted rounded-full w-20"></div>
              </div>
              <div class="flex gap-2">
                <div class="h-8 w-8 bg-muted rounded-lg"></div>
                <div class="h-8 w-8 bg-muted rounded-lg"></div>
              </div>
            </div>
          </template>
          <div v-else-if="!displayCategories.length" class="p-8 text-center text-secondary text-sm">
            {{ searchQuery ? `Tidak ada hasil untuk "${searchQuery}"` : 'Tidak ada data kategori' }}
          </div>
          <div
            v-for="cat in displayCategories"
            :key="cat.id"
            class="p-4 flex items-center justify-between gap-3"
            :class="loading ? 'opacity-50' : ''"
          >
            <div class="flex flex-col gap-1.5 min-w-0">
              <span class="font-medium text-foreground text-sm truncate">{{ cat.name }}</span>
              <span
                class="inline-flex items-center self-start px-2.5 py-1 rounded-full text-xs font-medium"
                :class="
                  cat.type === 'income' ? 'bg-success/10 text-success' : 'bg-error/10 text-error'
                "
              >
                {{ cat.type === 'income' ? 'Pemasukan' : 'Pengeluaran' }}
              </span>
            </div>
            <div v-if="deletingId === cat.id" class="flex items-center gap-2 shrink-0">
              <span class="text-xs text-secondary">Hapus?</span>
              <button
                @click="confirmDelete(cat.id)"
                class="px-2.5 py-1 text-xs font-medium bg-error text-white rounded-lg"
              >
                Ya
              </button>
              <button
                @click="deletingId = null"
                class="px-2.5 py-1 text-xs font-medium bg-muted text-secondary rounded-lg"
              >
                Batal
              </button>
            </div>
            <div v-else class="flex items-center gap-2 shrink-0">
              <button
                @click="editCategory(cat)"
                class="p-2 text-secondary hover:text-primary hover:bg-primary/5 rounded-lg transition-colors"
              >
                <Pencil :size="16" />
              </button>
              <button
                @click="deletingId = cat.id"
                class="p-2 text-secondary hover:text-error hover:bg-error/5 rounded-lg transition-colors"
              >
                <Trash2 :size="16" />
              </button>
            </div>
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
          <div
            v-if="serverError"
            class="p-4 bg-error/10 border border-error/20 rounded-xl text-sm text-error"
          >
            {{ serverError }}
          </div>
          <div class="flex flex-col gap-2">
            <label class="text-sm font-semibold text-foreground"
              >Jenis Transaksi <span class="text-error">*</span></label
            >
            <select
              v-model="form.type"
              class="w-full px-4 py-3 rounded-xl border focus:ring-1 focus:ring-primary outline-none bg-white text-sm"
              :class="errors.type ? 'border-error' : 'border-border'"
            >
              <option value="">Pilih Jenis</option>
              <option value="income">Pemasukan</option>
              <option value="expense">Pengeluaran</option>
            </select>
            <p v-if="errors.type" class="text-xs text-error">{{ errors.type }}</p>
          </div>
          <div class="flex flex-col gap-2">
            <label class="text-sm font-semibold text-foreground"
              >Nama Kategori <span class="text-error">*</span></label
            >
            <input
              v-model="form.name"
              type="text"
              placeholder="Contoh: Zakat, Infaq"
              class="w-full px-4 py-3 rounded-xl border focus:ring-1 focus:ring-primary outline-none bg-white text-sm"
              :class="errors.name ? 'border-error' : 'border-border'"
            />
            <p v-if="errors.name" class="text-xs text-error">{{ errors.name }}</p>
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
              :disabled="isSaving"
              class="px-6 py-2.5 rounded-xl font-bold bg-primary text-white hover:bg-primary-hover shadow-lg shadow-primary/20 transition-all flex items-center gap-2 text-sm disabled:opacity-70 disabled:cursor-not-allowed"
            >
              <Save :size="16" />
              <span
                >{{
                  isSaving ? 'Menyimpan...' : currentView === 'add' ? 'Simpan' : 'Update'
                }}
                Kategori</span
              >
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useCategoryStore } from '@/stores/category'
import {
  Search,
  Plus,
  Pencil,
  Trash2,
  Save,
  ChevronLeft,
  ChevronRight,
  X,
  CheckCircle,
} from 'lucide-vue-next'

const categoryStore = useCategoryStore()
const { categories, meta, loading } = storeToRefs(categoryStore)

const currentView = ref('list')
const searchQuery = ref('')
const displayCategories = ref([])
const form = ref({ id: null, name: '', type: '' })
const errors = ref({})
const serverError = ref('')
const isSaving = ref(false)
const deletingId = ref(null)
const currentPage = ref(1)
const perPage = 10

watch(
  categories,
  (val) => {
    displayCategories.value = val
  },
  { immediate: true },
)

const totalPages = computed(() => meta.value.last_page ?? 1)
const paginationInfo = computed(() => {
  const { from, to, total } = meta.value
  return from ? `Menampilkan ${from}-${to} dari ${total} kategori` : ''
})

onMounted(() => loadCategories())

async function loadCategories() {
  await categoryStore.fetchCategories({
    page: currentPage.value,
    per_page: perPage,
    search: searchQuery.value,
  })
}

let searchTimer
function onSearch() {
  clearTimeout(searchTimer)
  displayCategories.value = categories.value.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.value.toLowerCase()),
  )
  searchTimer = setTimeout(() => {
    currentPage.value = 1
    loadCategories()
  }, 400)
}

function changePage(page) {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
    loadCategories()
  }
}

function validate() {
  errors.value = {}
  if (!form.value.type) errors.value.type = 'Jenis transaksi wajib dipilih'
  if (!form.value.name.trim()) errors.value.name = 'Nama kategori wajib diisi'
  else if (form.value.name.trim().length < 3) errors.value.name = 'Nama kategori minimal 3 karakter'
  return !Object.keys(errors.value).length
}

function showAddForm() {
  form.value = { id: null, name: '', type: '' }
  errors.value = {}
  serverError.value = ''
  currentView.value = 'add'
}

function editCategory(cat) {
  form.value = { ...cat }
  errors.value = {}
  serverError.value = ''
  currentView.value = 'edit'
}

const deleteLoading = ref(false)
const successMessage = ref('')

async function confirmDelete(id) {
  deleteLoading.value = true
  try {
    await categoryStore.deleteCategory(id)
    deletingId.value = null
    successMessage.value = 'Kategori berhasil dihapus'
    setTimeout(() => (successMessage.value = ''), 3000)
    await loadCategories()
  } catch {
    deletingId.value = null
  } finally {
    deleteLoading.value = false
  }
}

async function saveCategory() {
  if (!validate()) return
  isSaving.value = true
  serverError.value = ''
  try {
    const payload = { name: form.value.name.trim(), type: form.value.type }
    if (currentView.value === 'add') {
      await categoryStore.createCategory(payload)
    } else {
      await categoryStore.updateCategory(form.value.id, payload)
    }
    const isAdd = currentView.value === 'add'
    currentView.value = 'list'
    successMessage.value = `Kategori berhasil ${isAdd ? 'ditambahkan' : 'diperbarui'}`
    setTimeout(() => (successMessage.value = ''), 3000)
    await loadCategories()
  } catch (error) {
    if (error.response?.status === 422) {
      const errs = error.response.data.errors
      errors.value = Object.fromEntries(Object.entries(errs).map(([k, v]) => [k, v[0]]))
    } else {
      serverError.value = 'Terjadi kesalahan, coba lagi'
    }
  } finally {
    isSaving.value = false
  }
}
</script>
