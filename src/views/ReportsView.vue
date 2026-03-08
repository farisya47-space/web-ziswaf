<template>
  <div class="flex-1 p-5 md:p-8">
    <div class="bg-white border border-border rounded-2xl p-6 md:p-8 shadow-sm mb-6">
      <h3 class="font-bold text-lg mb-6">Filter Laporan</h3>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div class="flex flex-col gap-2">
          <label class="text-sm font-semibold text-foreground">Tanggal Mulai</label>
          <input
            v-model="startDate"
            type="date"
            :max="endDate || today"
            class="w-full px-4 py-3 rounded-xl border border-border focus:ring-1 focus:ring-primary outline-none bg-white text-sm"
          >
        </div>
        <div class="flex flex-col gap-2">
          <label class="text-sm font-semibold text-foreground">Tanggal Akhir</label>
          <input
            v-model="endDate"
            type="date"
            :min="startDate"
            :max="today"
            class="w-full px-4 py-3 rounded-xl border border-border focus:ring-1 focus:ring-primary outline-none bg-white text-sm"
          >
        </div>
        <div class="flex items-end">
          <button @click="generateReport" :disabled="loading" class="w-full bg-primary text-white rounded-xl px-5 py-3 font-bold hover:bg-primary-hover transition-colors flex items-center justify-center gap-2 text-sm shadow-sm shadow-primary/20 disabled:opacity-70">
            <Loader2 v-if="loading" :size="16" class="animate-spin" />
            <Search v-else :size="16" />
            <span>{{ loading ? 'Memuat...' : 'Tampilkan Laporan' }}</span>
          </button>
        </div>
      </div>
    </div>

    <div v-if="error" class="mb-4 p-4 bg-error/10 border border-error/20 rounded-xl text-sm text-error">{{ error }}</div>

    <div v-if="showReport" class="bg-white border border-border rounded-2xl overflow-hidden shadow-sm">
      <div class="p-6 border-b border-border flex items-center justify-between">
        <h3 class="font-bold text-lg">Preview Laporan</h3>
        <button @click="exportPDF" class="bg-error text-white rounded-xl px-5 py-2.5 font-bold hover:bg-error/90 transition-colors flex items-center gap-2 text-sm">
          <Download :size="16" />
          <span>Export PDF</span>
        </button>
      </div>
      
      <div ref="reportContent" class="p-8 bg-white">
        <div class="text-center mb-8">
          <img src="/logo-yayasan.png" alt="Logo" class="w-20 h-20 mx-auto mb-4 object-contain">
          <h1 class="text-xl font-bold mb-2">MADARIJUS SALIKIN</h1>
          <p class="text-xs text-secondary">Jl. Raya Masjid No. 45, Bandung</p>
          <p class="text-xs text-secondary">Telp/Whatsapp: 08112070400 | Instagram: @mdsalikin_bdg</p>
          <div class="border-b-2 border-primary mt-4"></div>
        </div>

        <div class="text-center mb-6">
          <h3 class="text-base font-bold mb-1">LAPORAN KEUANGAN</h3>
          <p class="text-sm text-secondary">Periode: {{ formatDate(startDate) }} - {{ formatDate(endDate) }}</p>
        </div>

        <div class="mb-6">
          <h4 class="text-sm font-bold mb-3">Ringkasan Keuangan</h4>
          <table class="w-full text-sm border-collapse">
            <tbody>
              <tr class="bg-muted">
                <td class="p-3 border border-border font-semibold">Total Penerimaan Dana</td>
                <td class="p-3 border border-border text-right text-success font-bold">{{ formatCurrency(totalIncome) }}</td>
              </tr>
              <tr>
                <td class="p-3 border border-border font-semibold">Total Pengeluaran Dana</td>
                <td class="p-3 border border-border text-right text-error font-bold">{{ formatCurrency(totalExpense) }}</td>
              </tr>
              <tr class="bg-muted">
                <td class="p-3 border border-border font-bold">Saldo Dana</td>
                <td class="p-3 border border-border text-right font-bold text-primary">{{ formatCurrency(balance) }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="mb-6">
          <h4 class="text-sm font-bold mb-3">Detail Penerimaan Dana</h4>
          <table class="w-full text-xs border-collapse">
            <thead>
              <tr class="bg-primary text-white">
                <th class="p-2 border border-border text-left">Tanggal</th>
                <th class="p-2 border border-border text-left">Kategori</th>
                <th class="p-2 border border-border text-left">Keterangan</th>
                <th class="p-2 border border-border text-right">Nominal</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in incomeList" :key="item.id" :class="{ 'bg-muted': index % 2 === 1 }">
                <td class="p-2 border border-border">{{ formatDate(item.date) }}</td>
                <td class="p-2 border border-border">{{ item.category?.name }}</td>
                <td class="p-2 border border-border">{{ item.description ?? '-' }}</td>
                <td class="p-2 border border-border text-right">{{ formatCurrency(item.amount) }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="mb-10">
          <h4 class="text-sm font-bold mb-3">Detail Pengeluaran Dana</h4>
          <table class="w-full text-xs border-collapse">
            <thead>
              <tr class="bg-primary text-white">
                <th class="p-2 border border-border text-left">Tanggal</th>
                <th class="p-2 border border-border text-left">Kategori</th>
                <th class="p-2 border border-border text-left">Keterangan</th>
                <th class="p-2 border border-border text-right">Nominal</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in expenseList" :key="item.id" :class="{ 'bg-muted': index % 2 === 1 }">
                <td class="p-2 border border-border">{{ formatDate(item.date) }}</td>
                <td class="p-2 border border-border">{{ item.category?.name }}</td>
                <td class="p-2 border border-border">{{ item.description ?? '-' }}</td>
                <td class="p-2 border border-border text-right">{{ formatCurrency(item.amount) }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="text-right mt-12">
          <p class="text-xs text-secondary">Bandung, {{ formatDate(new Date()) }}</p>
          <p class="text-xs font-semibold mt-1 mb-20">Pimpinan Yayasan</p>
          <div class="inline-block border-t border-foreground pt-2">
            <p class="text-xs font-bold">Ustadz Anshorudin Ramdhani</p>
            <p class="text-xs text-secondary">Ketua Yayasan</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { Search, Download, Loader2 } from 'lucide-vue-next'
import { storeToRefs } from 'pinia'
import { useReportStore } from '@/stores/report'
import { formatCurrency } from '@/utils/helper'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'

const store = useReportStore()
const { report, loading } = storeToRefs(store)

const now = new Date()
const startDate = ref(new Date(now.getFullYear(), now.getMonth() - 1, now.getDate()).toISOString().split('T')[0])
const endDate = ref(now.toISOString().split('T')[0])
console.log('Initial Start Date:', startDate.value)
console.log('Initial End Date:', endDate.value)
const showReport = ref(false)
const reportContent = ref(null)
const error = ref('')

const totalIncome = computed(() => report.value?.total_income ?? 0)
const totalExpense = computed(() => report.value?.total_expense ?? 0)
const balance = computed(() => report.value?.balance ?? 0)
const incomeList = computed(() => report.value?.income_list ?? [])
const expenseList = computed(() => report.value?.expense_list ?? [])
const today = new Date().toISOString().split('T')[0]

const formatDate = (date) => {
  if (!date) return ''
  const d = new Date(date)
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des']
  return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`
}

const generateReport = async () => {
  error.value = ''
  showReport.value = false
  try {
    await store.generateReport(startDate.value, endDate.value)
    showReport.value = true
  } catch (err) {
    error.value = err.response?.data?.message || 'Gagal memuat laporan. Silakan coba lagi.'
  }
}

const exportPDF = async () => {
  const canvas = await html2canvas(reportContent.value, { scale: 2 })
  const imgData = canvas.toDataURL('image/png')
  const pdf = new jsPDF('p', 'mm', 'a4')
  const pdfWidth = pdf.internal.pageSize.getWidth()
  const pdfHeight = pdf.internal.pageSize.getHeight()
  const ratio = Math.min(pdfWidth / canvas.width, pdfHeight / canvas.height)
  pdf.addImage(imgData, 'PNG', 0, 0, canvas.width * ratio, canvas.height * ratio)
  pdf.save(`Laporan-Keuangan_${startDate.value}_${endDate.value}.pdf`)
}
</script>
