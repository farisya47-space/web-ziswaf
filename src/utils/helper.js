export const formatCurrency = (amount) =>
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount ?? 0)

export const formatDate = (date) =>
  date ? new Date(date).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }) : '-'

export const formatAmount = (value) => {
  const raw = String(value ?? '').replace(/\D/g, '')
  return raw ? Number(raw).toLocaleString('id-ID') : ''
}