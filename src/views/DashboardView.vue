<template>
  <div class="flex-1 p-5 md:p-8">
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
      <div class="flex flex-col rounded-2xl border border-border p-6 gap-3 bg-white shadow-sm hover:shadow-md transition-shadow">
        <div class="flex items-center justify-between">
          <div class="size-11 bg-success/10 rounded-xl flex items-center justify-center">
            <TrendingUp :size="24" class="text-success" />
          </div>
          <span class="text-xs font-semibold text-success bg-success/10 px-2 py-1 rounded-full">+12%</span>
        </div>
        <div>
          <p class="text-sm text-secondary mb-1">Total Penerimaan</p>
          <p class="font-bold text-2xl text-foreground">{{ formatCurrency(summary.total_income) }}</p>
          <p class="text-xs text-secondary mt-1">Bulan ini • {{ summary.income_count }} transaksi</p>
        </div>
      </div>

      <div class="flex flex-col rounded-2xl border border-border p-6 gap-3 bg-white shadow-sm hover:shadow-md transition-shadow">
        <div class="flex items-center justify-between">
          <div class="size-11 bg-error/10 rounded-xl flex items-center justify-center">
            <TrendingDown :size="24" class="text-error" />
          </div>
          <span class="text-xs font-semibold text-error bg-error/10 px-2 py-1 rounded-full">+8%</span>
        </div>
        <div>
          <p class="text-sm text-secondary mb-1">Total Pengeluaran</p>
          <p class="font-bold text-2xl text-foreground">{{ formatCurrency(summary.total_expense) }}</p>
          <p class="text-xs text-secondary mt-1">Bulan ini • {{ summary.expense_count }} transaksi</p>
        </div>
      </div>

      <div class="flex flex-col rounded-2xl border border-border p-6 gap-3 bg-white shadow-sm hover:shadow-md transition-shadow">
        <div class="flex items-center justify-between">
          <div class="size-11 bg-primary/10 rounded-xl flex items-center justify-center">
            <Wallet :size="24" class="text-primary" />
          </div>
          <span class="text-xs font-semibold text-primary bg-primary/10 px-2 py-1 rounded-full">Aktif</span>
        </div>
        <div>
          <p class="text-sm text-secondary mb-1">Saldo Dana</p>
          <p class="font-bold text-2xl text-foreground">{{ formatCurrency(summary.balance) }}</p>
          <p class="text-xs text-secondary mt-1">Per hari ini</p>
        </div>
      </div>

      <div class="flex flex-col rounded-2xl border border-border p-6 gap-3 bg-white shadow-sm hover:shadow-md transition-shadow">
        <div class="flex items-center justify-between">
          <div class="size-11 bg-warning/10 rounded-xl flex items-center justify-center">
            <Users :size="24" class="text-warning" />
          </div>
          <span class="text-xs font-semibold text-success bg-success/10 px-2 py-1 rounded-full">+5</span>
        </div>
        <div>
          <p class="text-sm text-secondary mb-1">Muzakki/Donatur</p>
          <p class="font-bold text-2xl text-foreground">{{ summary.donor_count }}</p>
          <p class="text-xs text-secondary mt-1">Bulan ini</p>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
      <div class="lg:col-span-2 flex flex-col rounded-2xl border border-border p-6 bg-white shadow-sm">
        <div class="flex items-center justify-between mb-6">
          <div>
            <h3 class="font-bold text-lg">Tren Keuangan</h3>
            <p class="text-sm text-secondary">Penerimaan vs Pengeluaran {{ period === '6months' ? '6 bulan terakhir' : 'tahun ini' }}</p>
          </div>
          <select v-model="period" @change="onPeriodChange" class="bg-muted border-none rounded-lg px-3 py-2 text-sm font-medium focus:ring-1 focus:ring-primary outline-none cursor-pointer">
            <option value="6months">6 Bulan Terakhir</option>
            <option value="year">Tahun Ini</option>
          </select>
        </div>
        <TrendChart :trend-data="trendData" :loading="loading" />
      </div>

      <div class="flex flex-col rounded-2xl border border-border p-6 bg-white shadow-sm">
        <h3 class="font-bold text-lg mb-2">Kategori Pengeluaran</h3>
        <p class="text-sm text-secondary mb-6">Distribusi bulan ini</p>
        <ExpenseChart :expense-data="expenseByCategory" :loading="loading" />
        <div class="mt-6 flex flex-col gap-3">
          <div v-for="(item, i) in expenseByCategory" :key="i" class="flex items-center justify-between text-sm">
            <div class="flex items-center gap-2">
              <span class="w-3 h-3 rounded-full" :style="{ backgroundColor: ['#004b72','#FED71F','#ED6B60','#30B22D'][i] }"></span>
              <span>{{ item.category }}</span>
            </div>
            <span class="font-semibold">{{ formatCurrency(item.amount) }}</span>
          </div>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div class="flex flex-col rounded-2xl border border-border p-6 bg-white shadow-sm">
        <div class="flex items-center justify-between mb-4">
          <h3 class="font-bold text-lg">Transaksi Terbaru</h3>
          <!-- <router-link to="/income" class="text-sm text-primary hover:text-primary-hover font-medium">Lihat Semua</router-link> -->
        </div>
        <div class="flex flex-col gap-3">
          <div v-for="trx in recentTransactions" :key="trx.id" class="flex items-center justify-between p-3 bg-muted/50 rounded-xl">
            <div class="flex items-center gap-3">
              <div class="size-10 rounded-lg flex items-center justify-center" :class="trx.type === 'income' ? 'bg-success/10' : 'bg-error/10'">
                <ArrowDownLeft v-if="trx.type === 'income'" :size="20" class="text-success" />
                <ArrowUpRight v-else :size="20" class="text-error" />
              </div>
              <div>
                <p class="font-semibold text-sm">{{ trx.category }}</p>
                <p class="text-xs text-secondary">{{ trx.date }}</p>
              </div>
            </div>
            <p class="font-bold" :class="trx.type === 'income' ? 'text-success' : 'text-error'">
              {{ trx.type === 'income' ? '+' : '-' }}{{ formatCurrency(trx.amount) }}
            </p>
          </div>
        </div>
      </div>

      <div class="flex flex-col rounded-2xl border border-border p-6 bg-white shadow-sm">
        <h3 class="font-bold text-lg mb-4">Ringkasan ZISWAF</h3>
        <div class="flex flex-col gap-4">
          <div class="p-4 bg-primary/5 rounded-xl border border-primary/20">
            <div class="flex items-center justify-between mb-2">
              <p class="font-semibold text-sm">Zakat</p>
              <span class="text-xs font-semibold text-primary bg-primary/10 px-2 py-1 rounded-full">Bulan Ini</span>
            </div>
            <p class="text-2xl font-bold text-primary mb-1">{{ formatCurrency(ziswaf.zakat?.amount) }}</p>
            <p class="text-xs text-secondary">Dari {{ ziswaf.zakat?.count }} muzakki</p>
          </div>
          <div class="p-4 bg-success/5 rounded-xl border border-success/20">
            <div class="flex items-center justify-between mb-2">
              <p class="font-semibold text-sm">Infaq & Sedekah</p>
              <span class="text-xs font-semibold text-success bg-success/10 px-2 py-1 rounded-full">Bulan Ini</span>
            </div>
            <p class="text-2xl font-bold text-success mb-1">{{ formatCurrency(ziswaf.infaq?.amount) }}</p>
            <p class="text-xs text-secondary">Dari {{ ziswaf.infaq?.count }} donatur</p>
          </div>
          <div class="p-4 bg-warning/5 rounded-xl border border-warning/20">
            <div class="flex items-center justify-between mb-2">
              <p class="font-semibold text-sm">Wakaf</p>
              <span class="text-xs font-semibold text-warning bg-warning/10 px-2 py-1 rounded-full">Tahun Ini</span>
            </div>
            <p class="text-2xl font-bold text-warning mb-1">{{ formatCurrency(ziswaf.wakaf?.amount) }}</p>
            <p class="text-xs text-secondary">Target: {{ formatCurrency(ziswaf.wakaf?.target) }} ({{ ziswaf.wakaf?.target ? Math.round(ziswaf.wakaf.amount / ziswaf.wakaf.target * 100) : 0 }}%)</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { TrendingUp, TrendingDown, Wallet, Users, ArrowDownLeft, ArrowUpRight } from 'lucide-vue-next'
import { useDashboardStore } from '@/stores/dashboard'
import { formatCurrency } from '@/utils/helper'
import TrendChart from '@/components/charts/TrendChart.vue'
import ExpenseChart from '@/components/charts/ExpenseChart.vue'

const store = useDashboardStore()
const { data, loading } = storeToRefs(store)

const summary = computed(() => data.value?.summary ?? {})
const trendData = computed(() => data.value?.trend_data ?? [])
const expenseByCategory = computed(() => data.value?.expense_by_category ?? [])
const recentTransactions = computed(() => data.value?.recent_transactions ?? [])
const ziswaf = computed(() => data.value?.ziswaf_summary ?? {})

const period = ref('6months')

onMounted(() => store.fetchDashboard(period.value))

function onPeriodChange() {
  store.fetchDashboard(period.value)
}
</script>
