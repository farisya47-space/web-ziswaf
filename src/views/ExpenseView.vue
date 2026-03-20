<template>
  <div class="flex-1 p-5 md:p-8">
    <Transition enter-from-class="opacity-0 translate-y-2" enter-active-class="transition-all duration-300" leave-to-class="opacity-0 translate-y-2" leave-active-class="transition-all duration-300">
      <div v-if="successMessage" class="fixed bottom-6 right-6 z-50 px-5 py-3 rounded-xl shadow-lg text-sm font-medium flex items-center gap-2 text-white"
        :style="{ backgroundColor: toastType === 'error' ? 'var(--color-error)' : 'var(--color-success)' }">
        <CheckCircle v-if="toastType === 'success'" :size="16" />
        <X v-else :size="16" />
        {{ successMessage }}
      </div>
    </Transition>

    <div v-if="currentView === 'list'">
      <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h3 class="font-semibold text-lg">Daftar Pengeluaran</h3>
          <p class="text-sm text-secondary">Total {{ meta.total ?? 0 }} transaksi</p>
        </div>
        <div class="flex gap-3 w-full md:w-auto">
          <div class="relative flex-1 md:w-64 md:flex-none">
            <div class="absolute left-3 top-1/2 -translate-y-1/2 text-secondary">
              <svg v-if="loading" class="animate-spin size-4" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
              </svg>
              <Search v-else :size="16" />
            </div>
            <input v-model="searchQuery" @input="onSearch" type="text" placeholder="Cari transaksi..." class="w-full pl-10 pr-8 py-2.5 rounded-xl border border-border focus:ring-1 focus:ring-primary outline-none text-sm" />
            <button v-if="searchQuery" @click="searchQuery = ''; onSearch()" class="absolute right-3 top-1/2 -translate-y-1/2 text-secondary hover:text-foreground">
              <X :size="14" />
            </button>
          </div>
          <button @click="showAddForm" class="bg-primary text-white rounded-xl px-4 py-2.5 font-bold hover:bg-primary-hover transition-colors flex items-center gap-2 text-sm shadow-sm shadow-primary/20 shrink-0">
            <Plus :size="16" /><span>Tambah Pengeluaran</span>
          </button>
        </div>
      </div>

      <div class="bg-white border border-border rounded-2xl overflow-hidden shadow-sm">
        <div class="hidden sm:block overflow-x-auto">
          <table class="w-full text-left text-sm whitespace-nowrap">
            <thead class="bg-muted/50 border-b border-border">
              <tr>
                <th class="p-4 pl-6 font-semibold text-secondary">No. Transaksi</th>
                <th class="p-4 font-semibold text-secondary">Tanggal</th>
                <th class="p-4 font-semibold text-secondary">Kategori</th>
                <th class="p-4 font-semibold text-secondary">Nominal</th>
                <th class="p-4 font-semibold text-secondary">Keterangan</th>
                <th class="p-4 pr-6 font-semibold text-secondary text-right">Aksi</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-border">
              <template v-if="loading && !transactions.length">
                <tr v-for="n in 5" :key="n" class="animate-pulse">
                  <td class="p-4 pl-6"><div class="h-4 bg-muted rounded w-28"></div></td>
                  <td class="p-4"><div class="h-4 bg-muted rounded w-24"></div></td>
                  <td class="p-4"><div class="h-4 bg-muted rounded w-20"></div></td>
                  <td class="p-4"><div class="h-4 bg-muted rounded w-24"></div></td>
                  <td class="p-4"><div class="h-4 bg-muted rounded w-32"></div></td>
                  <td class="p-4 pr-6"><div class="h-8 bg-muted rounded w-16 ml-auto"></div></td>
                </tr>
              </template>
              <tr v-else-if="loadError">
                <td colspan="6" class="p-8 text-center text-sm">
                  <div class="flex flex-col items-center gap-2 text-error">
                    <span>{{ loadError }}</span>
                    <button @click="loadTransactions" class="text-xs text-primary underline hover:no-underline">Coba lagi</button>
                  </div>
                </td>
              </tr>
              <tr v-else-if="!transactions.length">
                <td colspan="6" class="p-8 text-center text-secondary text-sm">
                  {{ searchQuery ? `Tidak ada hasil untuk "${searchQuery}"` : 'Tidak ada data pengeluaran' }}
                </td>
              </tr>
              <tr v-for="trx in transactions" :key="trx.id" class="hover:bg-muted/30 transition-all" :class="loading ? 'opacity-50' : ''">
                <td class="p-4 pl-6 font-medium text-primary">{{ trx.transaction_number }}</td>
                <td class="p-4 text-secondary">{{ formatDate(trx.date) }}</td>
                <td class="p-4"><span class="font-medium">{{ trx.category?.name }}</span></td>
                <td class="p-4 font-semibold text-error">{{ formatCurrency(trx.amount) }}</td>
                <td class="p-4 text-secondary">{{ trx.description ?? '-' }}</td>
                <td class="p-4 pr-6 text-right">
                  <div v-if="deletingId === trx.id" class="flex items-center justify-end gap-2">
                    <span class="text-xs text-secondary">Hapus?</span>
                    <button @click="confirmDelete(trx.id)" class="px-2.5 py-1 text-xs font-medium bg-error text-white rounded-lg hover:bg-error/90">Ya</button>
                    <button @click="deletingId = null" class="px-2.5 py-1 text-xs font-medium bg-muted text-secondary rounded-lg hover:bg-border">Batal</button>
                  </div>
                  <div v-else class="flex items-center justify-end gap-2">
                    <button @click="showInvoice(trx)" class="p-2 text-secondary hover:text-primary hover:bg-primary/5 rounded-lg transition-colors" title="Lihat Invoice"><FileText :size="16" /></button>
                    <button @click="editTransaction(trx)" class="p-2 text-secondary hover:text-primary hover:bg-primary/5 rounded-lg transition-colors"><Pencil :size="16" /></button>
                    <button @click="deletingId = trx.id" class="p-2 text-secondary hover:text-error hover:bg-error/5 rounded-lg transition-colors"><Trash2 :size="16" /></button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <!-- Mobile Card List -->
        <div class="sm:hidden divide-y divide-border">
          <template v-if="loading && !transactions.length">
            <div v-for="n in 5" :key="n" class="p-4 animate-pulse flex flex-col gap-2">
              <div class="h-4 bg-muted rounded w-28"></div>
              <div class="h-4 bg-muted rounded w-24"></div>
              <div class="h-4 bg-muted rounded w-32"></div>
            </div>
          </template>
          <div v-else-if="loadError" class="p-8 text-center text-sm">
            <div class="flex flex-col items-center gap-2 text-error">
              <span>{{ loadError }}</span>
              <button @click="loadTransactions" class="text-xs text-primary underline hover:no-underline">Coba lagi</button>
            </div>
          </div>
          <div v-else-if="!transactions.length" class="p-8 text-center text-secondary text-sm">
            {{ searchQuery ? `Tidak ada hasil untuk "${searchQuery}"` : 'Tidak ada data pengeluaran' }}
          </div>
          <div v-for="trx in transactions" :key="trx.id" class="p-4 flex items-start justify-between gap-3" :class="loading ? 'opacity-50' : ''">
            <div class="flex flex-col gap-1 min-w-0">
              <span class="text-xs font-medium text-primary">{{ trx.transaction_number }}</span>
              <span class="font-semibold text-error text-sm">{{ formatCurrency(trx.amount) }}</span>
              <span class="text-xs font-medium">{{ trx.category?.name }}</span>
              <span class="text-xs text-secondary">{{ formatDate(trx.date) }}</span>
              <span v-if="trx.description" class="text-xs text-secondary truncate">{{ trx.description }}</span>
            </div>
            <div v-if="deletingId === trx.id" class="flex items-center gap-2 shrink-0">
              <span class="text-xs text-secondary">Hapus?</span>
              <button @click="confirmDelete(trx.id)" class="px-2.5 py-1 text-xs font-medium bg-error text-white rounded-lg">Ya</button>
              <button @click="deletingId = null" class="px-2.5 py-1 text-xs font-medium bg-muted text-secondary rounded-lg">Batal</button>
            </div>
            <div v-else class="flex items-center gap-2 shrink-0">
              <button @click="showInvoice(trx)" class="p-2 text-secondary hover:text-primary hover:bg-primary/5 rounded-lg transition-colors"><FileText :size="16" /></button>
              <button @click="editTransaction(trx)" class="p-2 text-secondary hover:text-primary hover:bg-primary/5 rounded-lg transition-colors"><Pencil :size="16" /></button>
              <button @click="deletingId = trx.id" class="p-2 text-secondary hover:text-error hover:bg-error/5 rounded-lg transition-colors"><Trash2 :size="16" /></button>
            </div>
          </div>
        </div>
        <div class="p-4 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-secondary">
          <p>{{ paginationInfo }}</p>
          <div class="flex items-center gap-2">
            <button @click="changePage(currentPage - 1)" :disabled="currentPage === 1" class="p-2 border border-border rounded-lg hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed"><ChevronLeft :size="16" /></button>
            <button v-for="page in totalPages" :key="page" @click="changePage(page)" :class="page === currentPage ? 'bg-primary text-white' : 'hover:bg-muted'" class="px-3 py-1.5 rounded-lg font-medium">{{ page }}</button>
            <button @click="changePage(currentPage + 1)" :disabled="currentPage === totalPages" class="p-2 border border-border rounded-lg hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed"><ChevronRight :size="16" /></button>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="max-w-2xl mx-auto">
      <div class="bg-white border border-border rounded-2xl shadow-sm overflow-hidden">
        <div class="p-6 md:p-8 border-b border-border">
          <h3 class="font-bold text-lg text-foreground">{{ currentView === 'add' ? 'Tambah' : 'Edit' }} Pengeluaran</h3>
          <p class="text-sm text-secondary mt-1">{{ currentView === 'add' ? 'Lengkapi form untuk menambahkan pengeluaran baru' : 'Ubah data transaksi pengeluaran' }}</p>
        </div>
        <form @submit.prevent="saveTransaction" class="p-6 md:p-8 flex flex-col gap-6">
          <div v-if="serverError" class="p-4 bg-error/10 border border-error/20 rounded-xl text-sm text-error">{{ serverError }}</div>
          <div class="flex flex-col gap-2">
            <label class="text-sm font-semibold text-foreground">Kategori <span class="text-error">*</span></label>
            <select v-model="form.category_id" class="w-full px-4 py-3 rounded-xl border focus:ring-1 focus:ring-primary outline-none bg-white text-sm" :class="errors.category_id ? 'border-error' : 'border-border'">
              <option value="">Pilih Kategori</option>
              <option v-for="cat in expenseCategories" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
            </select>
            <p v-if="errors.category_id" class="text-xs text-error">{{ errors.category_id }}</p>
          </div>
          <div class="flex flex-col gap-2">
            <label class="text-sm font-semibold text-foreground">Tanggal <span class="text-error">*</span></label>
            <input v-model="form.date" type="date" class="w-full px-4 py-3 rounded-xl border focus:ring-1 focus:ring-primary outline-none bg-white text-sm" :class="errors.date ? 'border-error' : 'border-border'" />
            <p v-if="errors.date" class="text-xs text-error">{{ errors.date }}</p>
          </div>
          <div class="flex flex-col gap-2">
            <label class="text-sm font-semibold text-foreground">Nominal <span class="text-error">*</span></label>
            <div class="relative">
              <span class="absolute left-4 top-1/2 -translate-y-1/2 text-secondary font-medium text-sm">Rp</span>
              <input
                :value="displayAmount"
                @input="onAmountInput"
                @keydown="onAmountKeydown"
                @paste="onAmountPaste"
                type="text"
                inputmode="numeric"
                placeholder="0"
                class="w-full pl-10 pr-4 py-3 rounded-xl border focus:ring-1 focus:ring-primary outline-none bg-white text-sm"
                :class="errors.amount ? 'border-error' : 'border-border'"
              />
            </div>
            <p v-if="errors.amount" class="text-xs text-error">{{ errors.amount }}</p>
          </div>
          <div class="flex flex-col gap-2">
            <label class="text-sm font-semibold text-foreground">Keterangan</label>
            <textarea v-model="form.description" rows="3" placeholder="Tambahkan keterangan..." class="w-full px-4 py-3 rounded-xl border border-border focus:ring-1 focus:ring-primary outline-none bg-white text-sm resize-none"></textarea>
          </div>
          <div class="flex items-center justify-end gap-4 mt-4 pt-6 border-t border-border">
            <button type="button" @click="currentView = 'list'" class="px-6 py-2.5 rounded-xl font-bold text-secondary hover:bg-muted transition-colors text-sm">Batal</button>
            <button type="submit" :disabled="isSaving" class="px-6 py-2.5 rounded-xl font-bold bg-primary text-white hover:bg-primary-hover shadow-lg shadow-primary/20 transition-all flex items-center gap-2 text-sm disabled:opacity-70 disabled:cursor-not-allowed">
              <Save :size="16" />
              <span>{{ isSaving ? 'Menyimpan...' : currentView === 'add' ? 'Simpan' : 'Update' }} Transaksi</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>

  <!-- Invoice Modal -->
  <Teleport to="body">
    <div v-if="invoiceData" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" @click.self="invoiceData = null">
      <div class="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div class="flex items-center justify-between p-4 border-b border-border">
          <h3 class="font-bold text-base">Invoice Pengeluaran</h3>
          <div class="flex items-center gap-2">
            <button @click="exportInvoicePDF" :disabled="isExporting" class="bg-error text-white rounded-xl px-4 py-2 font-bold text-sm flex items-center gap-2 hover:bg-error/90 disabled:opacity-70">
              <Download :size="14" /><span>{{ isExporting ? 'Mengekspor...' : 'Export PDF' }}</span>
            </button>
            <button @click="invoiceData = null" class="p-2 hover:bg-muted rounded-lg"><X :size="16" /></button>
          </div>
        </div>
        <div ref="invoiceRef" class="p-8 bg-white">
          <div class="text-center mb-6">
            <img src="/logo-yayasan.png" alt="Logo" class="w-16 h-16 mx-auto mb-3 object-contain">
            <h1 class="text-lg font-bold">MADARIJUS SALIKIN</h1>
            <p class="text-xs text-secondary">Jl. Raya Masjid No. 45, Bandung</p>
            <p class="text-xs text-secondary">Telp/Whatsapp: 08112070400 | Instagram: @mdsalikin_bdg</p>
            <div class="border-b-2 border-primary mt-3"></div>
          </div>
          <div class="text-center mb-6">
            <h2 class="text-base font-bold tracking-widest">BUKTI PENGELUARAN DANA</h2>
          </div>
          <div class="mb-6 text-sm">
            <table class="w-full">
              <tbody>
                <tr>
                  <td class="py-1 text-secondary w-40">No. Transaksi</td>
                  <td class="py-1 font-medium">: {{ invoiceData.transaction_number }}</td>
                </tr>
                <tr>
                  <td class="py-1 text-secondary">Tanggal</td>
                  <td class="py-1">: {{ formatDate(invoiceData.date) }}</td>
                </tr>
                <tr>
                  <td class="py-1 text-secondary">Kategori</td>
                  <td class="py-1">: {{ invoiceData.category?.name }}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <table class="w-full text-sm border-collapse mb-6">
            <thead>
              <tr class="bg-primary text-white">
                <th class="p-3 border border-border text-left">Keterangan</th>
                <th class="p-3 border border-border text-right">Nominal</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td class="p-3 border border-border">{{ invoiceData.description || 'Pengeluaran Dana ' + invoiceData.category?.name }}</td>
                <td class="p-3 border border-border text-right font-bold text-error">{{ formatCurrency(invoiceData.amount) }}</td>
              </tr>
              <tr class="bg-muted">
                <td class="p-3 border border-border font-bold">Total</td>
                <td class="p-3 border border-border text-right font-bold text-primary">{{ formatCurrency(invoiceData.amount) }}</td>
              </tr>
            </tbody>
          </table>
          <div class="text-right mt-10">
            <p class="text-xs text-secondary">Bandung, {{ formatDate(new Date()) }}</p>
            <p class="text-xs font-semibold mt-1 mb-16">Pimpinan Yayasan</p>
            <div class="inline-block border-t border-foreground pt-2">
              <p class="text-xs font-bold">Ustadz Anshorudin Ramdhani</p>
              <p class="text-xs text-secondary">Ketua Yayasan</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useTransactionStore } from '@/stores/transaction'
import { useCategoryStore } from '@/stores/category'
import { formatCurrency, formatDate, formatAmount } from '@/utils/helper'
import { Search, Plus, Pencil, Trash2, Save, ChevronLeft, ChevronRight, X, CheckCircle, FileText, Download } from 'lucide-vue-next'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'

const store = useTransactionStore()
const categoryStore = useCategoryStore()
const { transactions, meta, loading } = storeToRefs(store)

const currentView = ref('list')
const searchQuery = ref('')
const form = ref({ id: null, category_id: '', date: '', amount: 0, description: '' })
const errors = ref({})
const serverError = ref('')
const isSaving = ref(false)
const deletingId = ref(null)
const successMessage = ref('')
const currentPage = ref(1)
const perPage = 10
const displayAmount = ref('')
const loadError = ref('')
const toastType = ref('success')
const invoiceData = ref(null)
const invoiceRef = ref(null)
const isExporting = ref(false)

const expenseCategories = computed(() => categoryStore.categories.filter(c => c.type === 'expense'))

const totalPages = computed(() => meta.value?.last_page ?? 1)
const paginationInfo = computed(() => {
  const { from, to, total } = meta.value ?? {}
  return from ? `Menampilkan ${from}-${to} dari ${total} transaksi` : ''
})

let searchTimer
function onSearch() {
  clearTimeout(searchTimer)
  searchTimer = setTimeout(() => { currentPage.value = 1; loadTransactions() }, 400)
}

function changePage(page) {
  if (page >= 1 && page <= totalPages.value) { currentPage.value = page; loadTransactions() }
}

function validate() {
  errors.value = {}
  if (!form.value.category_id) errors.value.category_id = 'Kategori wajib dipilih'
  if (!form.value.date) errors.value.date = 'Tanggal wajib diisi'
  if (!form.value.amount || form.value.amount <= 0) errors.value.amount = 'Nominal harus lebih dari 0'
  return !Object.keys(errors.value).length
}

function onAmountKeydown(e) {
  const allowed = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab', 'Home', 'End']
  if (!allowed.includes(e.key) && !/^\d$/.test(e.key)) e.preventDefault()
}

function onAmountPaste(e) {
  e.preventDefault()
  const pasted = (e.clipboardData || window.clipboardData).getData('text').replace(/\D/g, '')
  if (!pasted) return
  form.value.amount = Number(pasted)
  displayAmount.value = formatAmount(pasted)
}

function onAmountInput(e) {
  const raw = e.target.value.replace(/\D/g, '')
  form.value.amount = raw ? Number(raw) : 0
  displayAmount.value = formatAmount(raw)
}

function getErrorMessage(error) {
  if (!error.response) return 'Tidak dapat terhubung ke server'
  return error.response.data?.message ?? `Terjadi kesalahan (${error.response.status})`
}

function showToast(message, type = 'success') {
  toastType.value = type
  successMessage.value = message
  setTimeout(() => successMessage.value = '', 3000)
}

function showInvoice(trx) {
  invoiceData.value = trx
}

async function exportInvoicePDF() {
  isExporting.value = true
  try {
    const canvas = await html2canvas(invoiceRef.value, { scale: 2 })
    const imgData = canvas.toDataURL('image/png')
    const pdf = new jsPDF('p', 'mm', 'a4')
    const pdfWidth = pdf.internal.pageSize.getWidth()
    const pdfHeight = pdf.internal.pageSize.getHeight()
    const ratio = Math.min(pdfWidth / canvas.width, pdfHeight / canvas.height)
    pdf.addImage(imgData, 'PNG', 0, 0, canvas.width * ratio, canvas.height * ratio)
    pdf.save(`Invoice-${invoiceData.value.transaction_number}.pdf`)
  } finally {
    isExporting.value = false
  }
}

async function loadTransactions() {
  loadError.value = ''
  try {
    await store.fetchTransactions('expenses', { page: currentPage.value, per_page: perPage, search: searchQuery.value })
  } catch (error) {
    loadError.value = getErrorMessage(error)
  }
}

onMounted(() => loadTransactions())

async function showAddForm() {
  form.value = { id: null, category_id: '', date: new Date().toISOString().split('T')[0], amount: 0, description: '' }
  errors.value = {}
  serverError.value = ''
  await categoryStore.fetchCategories({ type: 'expense', per_page: 100 })
  currentView.value = 'add'
  displayAmount.value = form.value.amount ? form.value.amount.toString() : ''
}

async function editTransaction(trx) {
  form.value = { id: trx.id, category_id: trx.category_id, date: trx.date, amount: trx.amount, description: trx.description }
  errors.value = {}
  serverError.value = ''
  await categoryStore.fetchCategories({ type: 'expense', per_page: 100 })
  currentView.value = 'edit'
  displayAmount.value = form.value.amount ? formatAmount(form.value.amount) : ''
}

async function saveTransaction() {
  if (!validate()) return
  isSaving.value = true
  serverError.value = ''
  try {
    const payload = { category_id: form.value.category_id, date: form.value.date, amount: form.value.amount, description: form.value.description }
    const isAdd = currentView.value === 'add'
    if (isAdd) { await store.createTransaction('expenses', payload) }
    else { await store.updateTransaction('expenses', form.value.id, payload) }
    currentView.value = 'list'
    showToast(`Pengeluaran berhasil ${isAdd ? 'ditambahkan' : 'diperbarui'}`)
    await loadTransactions()
  } catch (error) {
    if (error.response?.status === 422) {
      const errs = error.response.data.errors
      errors.value = Object.fromEntries(Object.entries(errs).map(([k, v]) => [k, v[0]]))
    } else {
      serverError.value = getErrorMessage(error)
    }
  } finally { isSaving.value = false }
}

async function confirmDelete(id) {
  try {
    await store.deleteTransaction('expenses', id)
    deletingId.value = null
    showToast('Pengeluaran berhasil dihapus')
    await loadTransactions()
  } catch (error) {
    deletingId.value = null
    serverError.value = getErrorMessage(error)
  }
}
</script>
