<template>
  <div class="flex-1 p-5 md:p-8">
    <div class="bg-white border border-border rounded-2xl p-6 md:p-8 shadow-sm mb-6">
      <h3 class="font-bold text-lg mb-6">Filter Laporan</h3>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div class="flex flex-col gap-2">
          <label class="text-sm font-semibold text-foreground">Tanggal Mulai</label>
          <input v-model="startDate" type="date" class="w-full px-4 py-3 rounded-xl border border-border focus:ring-1 focus:ring-primary outline-none bg-white text-sm">
        </div>
        <div class="flex flex-col gap-2">
          <label class="text-sm font-semibold text-foreground">Tanggal Akhir</label>
          <input v-model="endDate" type="date" class="w-full px-4 py-3 rounded-xl border border-border focus:ring-1 focus:ring-primary outline-none bg-white text-sm">
        </div>
        <div class="flex items-end">
          <button @click="generateReport" class="w-full bg-primary text-white rounded-xl px-5 py-3 font-bold hover:bg-primary-hover transition-colors flex items-center justify-center gap-2 text-sm shadow-sm shadow-primary/20">
            <Search :size="16" />
            <span>Tampilkan Laporan</span>
          </button>
        </div>
      </div>
    </div>

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
                <td class="p-3 border border-border text-right text-success font-bold">Rp {{ totalIncome.toLocaleString() }}</td>
              </tr>
              <tr>
                <td class="p-3 border border-border font-semibold">Total Pengeluaran Dana</td>
                <td class="p-3 border border-border text-right text-error font-bold">Rp {{ totalExpense.toLocaleString() }}</td>
              </tr>
              <tr class="bg-muted">
                <td class="p-3 border border-border font-bold">Saldo Dana</td>
                <td class="p-3 border border-border text-right font-bold text-primary">Rp {{ balance.toLocaleString() }}</td>
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
              <tr v-for="(item, index) in incomeList" :key="index" :class="{ 'bg-muted': index % 2 === 1 }">
                <td class="p-2 border border-border">{{ item.date }}</td>
                <td class="p-2 border border-border">{{ item.category }}</td>
                <td class="p-2 border border-border">{{ item.description }}</td>
                <td class="p-2 border border-border text-right">Rp {{ item.amount.toLocaleString() }}</td>
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
              <tr v-for="(item, index) in expenseList" :key="index" :class="{ 'bg-muted': index % 2 === 1 }">
                <td class="p-2 border border-border">{{ item.date }}</td>
                <td class="p-2 border border-border">{{ item.category }}</td>
                <td class="p-2 border border-border">{{ item.description }}</td>
                <td class="p-2 border border-border text-right">Rp {{ item.amount.toLocaleString() }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="text-right mt-12">
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
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { Search, Download } from 'lucide-vue-next'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'

const startDate = ref('')
const endDate = ref('')
const showReport = ref(false)
const reportContent = ref(null)

const totalIncome = computed(() => 85500000)
const totalExpense = computed(() => 52300000)
const balance = computed(() => totalIncome.value - totalExpense.value)

const incomeList = ref([
  { date: '15 Mar 2026', category: 'Zakat Fitrah', description: 'Zakat fitrah dari muzakki', amount: 25000000 },
  { date: '20 Mar 2026', category: 'Infaq', description: 'Infaq dari donatur', amount: 15000000 },
  { date: '22 Mar 2026', category: 'Sedekah', description: 'Sedekah untuk yatim piatu', amount: 8500000 },
  { date: '25 Mar 2026', category: 'Wakaf', description: 'Wakaf untuk pembangunan masjid', amount: 37000000 }
])

const expenseList = ref([
  { date: '10 Mar 2026', category: 'Bantuan Mustahik', description: 'Bantuan untuk 15 mustahik', amount: 20000000 },
  { date: '12 Mar 2026', category: 'Biaya Haji', description: 'Pembayaran haji untuk jamaah', amount: 25000000 },
  { date: '15 Mar 2026', category: 'Operasional', description: 'Biaya operasional kantor', amount: 5000000 },
  { date: '18 Mar 2026', category: 'Program Dakwah', description: 'Kegiatan dakwah bulanan', amount: 2300000 }
])

const formatDate = (date) => {
  if (!date) return ''
  const d = new Date(date)
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des']
  return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`
}

const generateReport = () => {
  if (!startDate.value || !endDate.value) {
    alert('Pilih tanggal mulai dan akhir terlebih dahulu')
    return
  }
  showReport.value = true
}

const exportPDF = async () => {
  const canvas = await html2canvas(reportContent.value, { scale: 2 })
  const imgData = canvas.toDataURL('image/png')
  const pdf = new jsPDF('p', 'mm', 'a4')
  const pdfWidth = pdf.internal.pageSize.getWidth()
  const pdfHeight = pdf.internal.pageSize.getHeight()
  const imgWidth = canvas.width
  const imgHeight = canvas.height
  const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight)
  pdf.addImage(imgData, 'PNG', 0, 0, imgWidth * ratio, imgHeight * ratio)
  pdf.save('Laporan-Keuangan.pdf')
}

onMounted(() => {
  const today = new Date()
  const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, today.getDate())
  startDate.value = today.toISOString().split('T')[0]
  endDate.value = nextMonth.toISOString().split('T')[0]
})
</script>
