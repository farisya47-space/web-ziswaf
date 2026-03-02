<template>
  <div class="flex-1 p-5 md:p-8">
    <div v-if="currentView === 'list'">
      <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h3 class="font-semibold text-lg">Daftar Pengeluaran</h3>
          <p class="text-sm text-secondary">Total {{ transactions.length }} transaksi</p>
        </div>
        <div class="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div class="relative w-full sm:w-64">
            <Search :size="16" class="absolute left-3 top-1/2 -translate-y-1/2 text-secondary" />
            <input v-model="searchQuery" type="text" placeholder="Cari transaksi..." class="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border focus:ring-1 focus:ring-primary outline-none text-sm">
          </div>
          <button @click="showAddForm" class="bg-primary text-white rounded-xl px-5 py-2.5 font-bold hover:bg-primary-hover transition-colors flex items-center justify-center gap-2 text-sm shadow-sm shadow-primary/20">
            <Plus :size="16" />
            <span>Tambah Pengeluaran</span>
          </button>
        </div>
      </div>

      <div class="bg-white border border-border rounded-2xl overflow-hidden shadow-sm">
        <div class="overflow-x-auto">
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
              <tr v-for="trx in paginatedTransactions" :key="trx.id" class="hover:bg-muted/30 transition-colors">
                <td class="p-4 pl-6 font-medium text-primary">{{ trx.number }}</td>
                <td class="p-4 text-secondary">{{ trx.date }}</td>
                <td class="p-4"><span class="font-medium">{{ trx.category }}</span></td>
                <td class="p-4 font-semibold text-error">Rp {{ trx.amount.toLocaleString() }}</td>
                <td class="p-4 text-secondary">{{ trx.description }}</td>
                <td class="p-4 pr-6 text-right">
                  <div class="flex items-center justify-end gap-2">
                    <button @click="editTransaction(trx)" class="p-2 text-secondary hover:text-primary hover:bg-primary/5 rounded-lg transition-colors">
                      <Pencil :size="16" />
                    </button>
                    <button @click="deleteTransaction(trx.id)" class="p-2 text-secondary hover:text-error hover:bg-error/5 rounded-lg transition-colors">
                      <Trash2 :size="16" />
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="p-4 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-secondary">
          <p>{{ paginationInfo }}</p>
          <div class="flex items-center gap-2">
            <button @click="changePage(currentPage - 1)" :disabled="currentPage === 1" class="p-2 border border-border rounded-lg hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed">
              <ChevronLeft :size="16" />
            </button>
            <button v-for="page in totalPages" :key="page" @click="changePage(page)" :class="page === currentPage ? 'bg-primary text-white' : 'hover:bg-muted'" class="px-3 py-1.5 rounded-lg font-medium">
              {{ page }}
            </button>
            <button @click="changePage(currentPage + 1)" :disabled="currentPage === totalPages" class="p-2 border border-border rounded-lg hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed">
              <ChevronRight :size="16" />
            </button>
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
          <div class="flex flex-col gap-2">
            <label class="text-sm font-semibold text-foreground">No. Transaksi</label>
            <input v-model="form.number" type="text" readonly class="w-full px-4 py-3 rounded-xl border border-border bg-muted text-secondary text-sm cursor-not-allowed">
          </div>
          <div class="flex flex-col gap-2">
            <label class="text-sm font-semibold text-foreground">Kategori <span class="text-error">*</span></label>
            <select v-model="form.category" required class="w-full px-4 py-3 rounded-xl border border-border focus:ring-1 focus:ring-primary outline-none bg-white text-sm">
              <option value="">Pilih Kategori</option>
              <option value="Bantuan Mustahik">Bantuan Mustahik</option>
              <option value="Operasional Kantor">Operasional Kantor</option>
              <option value="Biaya Haji">Biaya Haji</option>
              <option value="Biaya Umroh">Biaya Umroh</option>
              <option value="Utilitas">Utilitas</option>
              <option value="Program Dakwah">Program Dakwah</option>
            </select>
          </div>
          <div class="flex flex-col gap-2">
            <label class="text-sm font-semibold text-foreground">Tanggal <span class="text-error">*</span></label>
            <input v-model="form.date" type="date" required class="w-full px-4 py-3 rounded-xl border border-border focus:ring-1 focus:ring-primary outline-none bg-white text-sm">
          </div>
          <div class="flex flex-col gap-2">
            <label class="text-sm font-semibold text-foreground">Nominal <span class="text-error">*</span></label>
            <div class="relative">
              <span class="absolute left-4 top-1/2 -translate-y-1/2 text-secondary font-medium text-sm">Rp</span>
              <input v-model.number="form.amount" type="number" required placeholder="0" class="w-full pl-10 pr-4 py-3 rounded-xl border border-border focus:ring-1 focus:ring-primary outline-none bg-white text-sm">
            </div>
          </div>
          <div class="flex flex-col gap-2">
            <label class="text-sm font-semibold text-foreground">Keterangan</label>
            <textarea v-model="form.description" rows="3" placeholder="Tambahkan keterangan..." class="w-full px-4 py-3 rounded-xl border border-border focus:ring-1 focus:ring-primary outline-none bg-white text-sm resize-none"></textarea>
          </div>
          <div class="flex items-center justify-end gap-4 mt-4 pt-6 border-t border-border">
            <button type="button" @click="currentView = 'list'" class="px-6 py-2.5 rounded-xl font-bold text-secondary hover:bg-muted transition-colors text-sm">Batal</button>
            <button type="submit" class="px-6 py-2.5 rounded-xl font-bold bg-primary text-white hover:bg-primary-hover shadow-lg shadow-primary/20 transition-all flex items-center gap-2 text-sm">
              <Save :size="16" />
              <span>{{ currentView === 'add' ? 'Simpan' : 'Update' }} Transaksi</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { Search, Plus, Pencil, Trash2, Save, ChevronLeft, ChevronRight } from 'lucide-vue-next'

const currentView = ref('list')
const searchQuery = ref('')
const form = ref({ id: null, number: '', category: '', date: '', amount: 0, description: '' })
const currentPage = ref(1)
const perPage = 10

const transactions = ref([
  { id: 1, number: 'OUT010987654', date: '10 Mar 2026', category: 'Bantuan Mustahik', amount: 3500000, description: 'Bantuan untuk 7 mustahik' },
  { id: 2, number: 'OUT012567812', date: '12 Mar 2026', category: 'Operasional Kantor', amount: 2000000, description: 'Biaya operasional bulanan' },
  { id: 3, number: 'OUT015432198', date: '15 Mar 2026', category: 'Biaya Haji', amount: 25000000, description: 'Pembayaran haji untuk jamaah' },
  { id: 4, number: 'OUT018765432', date: '18 Mar 2026', category: 'Utilitas', amount: 1500000, description: 'Listrik, air, dan internet' }
])

const totalPages = computed(() => Math.ceil(transactions.value.length / perPage))
const paginatedTransactions = computed(() => {
  const start = (currentPage.value - 1) * perPage
  return transactions.value.slice(start, start + perPage)
})
const paginationInfo = computed(() => {
  const start = (currentPage.value - 1) * perPage + 1
  const end = Math.min(currentPage.value * perPage, transactions.value.length)
  return `Menampilkan ${start}-${end} dari ${transactions.value.length} transaksi`
})

const changePage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
  }
}

const generateTrxNumber = () => {
  const timestamp = Date.now().toString().slice(-6)
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0')
  return `OUT${timestamp}${random}`
}

const showAddForm = () => {
  form.value = { id: null, number: generateTrxNumber(), category: '', date: new Date().toISOString().split('T')[0], amount: 0, description: '' }
  currentView.value = 'add'
}

const editTransaction = (trx) => {
  form.value = { ...trx }
  currentView.value = 'edit'
}

const saveTransaction = () => {
  if (currentView.value === 'add') {
    transactions.value.push({ ...form.value, id: Date.now() })
  } else {
    const index = transactions.value.findIndex(t => t.id === form.value.id)
    if (index !== -1) transactions.value[index] = { ...form.value }
  }
  currentView.value = 'list'
}

const deleteTransaction = (id) => {
  if (confirm('Apakah Anda yakin ingin menghapus transaksi ini?')) {
    transactions.value = transactions.value.filter(t => t.id !== id)
  }
}
</script>
