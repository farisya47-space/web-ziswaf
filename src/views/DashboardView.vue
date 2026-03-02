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
          <p class="font-bold text-2xl text-foreground">Rp 85.500.000</p>
          <p class="text-xs text-secondary mt-1">Bulan ini • 45 transaksi</p>
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
          <p class="font-bold text-2xl text-foreground">Rp 52.300.000</p>
          <p class="text-xs text-secondary mt-1">Bulan ini • 38 transaksi</p>
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
          <p class="font-bold text-2xl text-foreground">Rp 125.800.000</p>
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
          <p class="font-bold text-2xl text-foreground">127</p>
          <p class="text-xs text-secondary mt-1">Bulan ini</p>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
      <div class="lg:col-span-2 flex flex-col rounded-2xl border border-border p-6 bg-white shadow-sm">
        <div class="flex items-center justify-between mb-6">
          <div>
            <h3 class="font-bold text-lg">Tren Keuangan</h3>
            <p class="text-sm text-secondary">Penerimaan vs Pengeluaran 6 bulan terakhir</p>
          </div>
          <select class="bg-muted border-none rounded-lg px-3 py-2 text-sm font-medium focus:ring-1 focus:ring-primary outline-none cursor-pointer">
            <option>6 Bulan Terakhir</option>
            <option>Tahun Ini</option>
          </select>
        </div>
        <TrendChart />
      </div>

      <div class="flex flex-col rounded-2xl border border-border p-6 bg-white shadow-sm">
        <h3 class="font-bold text-lg mb-2">Kategori Pengeluaran</h3>
        <p class="text-sm text-secondary mb-6">Distribusi bulan ini</p>
        <ExpenseChart />
        <div class="mt-6 flex flex-col gap-3">
          <div class="flex items-center justify-between text-sm">
            <div class="flex items-center gap-2"><span class="w-3 h-3 rounded-full bg-primary"></span><span>Mustahik</span></div>
            <span class="font-semibold">Rp 20.9Jt</span>
          </div>
          <div class="flex items-center justify-between text-sm">
            <div class="flex items-center gap-2"><span class="w-3 h-3 rounded-full bg-warning"></span><span>Operasional</span></div>
            <span class="font-semibold">Rp 18.3Jt</span>
          </div>
          <div class="flex items-center justify-between text-sm">
            <div class="flex items-center gap-2"><span class="w-3 h-3 rounded-full bg-error"></span><span>Program</span></div>
            <span class="font-semibold">Rp 7.8Jt</span>
          </div>
          <div class="flex items-center justify-between text-sm">
            <div class="flex items-center gap-2"><span class="w-3 h-3 rounded-full bg-success"></span><span>Lainnya</span></div>
            <span class="font-semibold">Rp 5.3Jt</span>
          </div>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div class="flex flex-col rounded-2xl border border-border p-6 bg-white shadow-sm">
        <div class="flex items-center justify-between mb-4">
          <h3 class="font-bold text-lg">Transaksi Terbaru</h3>
          <router-link to="/income" class="text-sm text-primary hover:text-primary-hover font-medium">Lihat Semua</router-link>
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
            <p class="font-bold" :class="trx.type === 'income' ? 'text-success' : 'text-error'">{{ trx.type === 'income' ? '+' : '-' }}Rp {{ trx.amount.toLocaleString() }}</p>
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
            <p class="text-2xl font-bold text-primary mb-1">Rp 45.000.000</p>
            <p class="text-xs text-secondary">Dari 85 muzakki</p>
          </div>
          <div class="p-4 bg-success/5 rounded-xl border border-success/20">
            <div class="flex items-center justify-between mb-2">
              <p class="font-semibold text-sm">Infaq & Sedekah</p>
              <span class="text-xs font-semibold text-success bg-success/10 px-2 py-1 rounded-full">Bulan Ini</span>
            </div>
            <p class="text-2xl font-bold text-success mb-1">Rp 28.500.000</p>
            <p class="text-xs text-secondary">Dari 127 donatur</p>
          </div>
          <div class="p-4 bg-warning/5 rounded-xl border border-warning/20">
            <div class="flex items-center justify-between mb-2">
              <p class="font-semibold text-sm">Wakaf</p>
              <span class="text-xs font-semibold text-warning bg-warning/10 px-2 py-1 rounded-full">Tahun Ini</span>
            </div>
            <p class="text-2xl font-bold text-warning mb-1">Rp 125.000.000</p>
            <p class="text-xs text-secondary">Target: Rp 150Jt (83%)</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { TrendingUp, TrendingDown, Wallet, Users, ArrowDownLeft, ArrowUpRight } from 'lucide-vue-next'
import TrendChart from '@/components/charts/TrendChart.vue'
import ExpenseChart from '@/components/charts/ExpenseChart.vue'

const recentTransactions = ref([
  { id: 1, category: 'Zakat Fitrah', date: 'Hari ini, 10:30', amount: 2500000, type: 'income' },
  { id: 2, category: 'Bantuan Mustahik', date: 'Kemarin, 14:20', amount: 850000, type: 'expense' },
  { id: 3, category: 'Infaq Donatur', date: '2 hari lalu, 09:15', amount: 15000000, type: 'income' },
  { id: 4, category: 'Operasional Kantor', date: '3 hari lalu, 11:45', amount: 1200000, type: 'expense' }
])
</script>
