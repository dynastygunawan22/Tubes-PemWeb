export const MONTH_NAMES = [
  'Januari',
  'Februari',
  'Maret',
  'April',
  'Mei',
  'Juni',
  'Juli',
  'Agustus',
  'September',
  'Oktober',
  'November',
  'Desember',
]

export const SHORT_DAY_NAMES = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab']

export function toISODate(dateInput = new Date()) {
  const d = dateInput instanceof Date ? dateInput : new Date(dateInput)
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function getTodayISO() {
  return toISODate(new Date())
}

export function addDaysToISO(baseDate, daysOffset = 0) {
  const d = baseDate instanceof Date ? new Date(baseDate) : parseISODate(baseDate)
  d.setDate(d.getDate() + Number(daysOffset || 0))
  return toISODate(d)
}

export function parseISODate(isoString) {
  if (!isoString || typeof isoString !== 'string') return new Date()
  const parts = isoString.split('-').map(Number)
  if (parts.length !== 3 || parts.some((n) => Number.isNaN(n))) {
    return new Date()
  }
  return new Date(parts[0], parts[1] - 1, parts[2])
}

export function formatShortDate(isoString) {
  if (!isoString) return '-'
  const date = parseISODate(isoString)
  return new Intl.DateTimeFormat('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(date)
}

export function formatLongDate(isoString) {
  if (!isoString) return '-'
  const date = parseISODate(isoString)
  return new Intl.DateTimeFormat('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date)
}

export function isTaskOverdue(task) {
  if (!task || task.status === 'selesai' || !task.dueDate) return false
  const due = parseISODate(task.dueDate)
  due.setHours(0, 0, 0, 0)
  const now = new Date()
  now.setHours(0, 0, 0, 0)
  return due < now
}

export function fitDateToMonth(isoString, targetMonthIndex) {
  const year = new Date().getFullYear()
  const parsed = isoString ? parseISODate(isoString) : new Date(year, targetMonthIndex, 1)
  if (parsed.getMonth() === targetMonthIndex && parsed.getFullYear() === year) {
    return toISODate(parsed)
  }
  return toISODate(new Date(year, targetMonthIndex, 1))
}

export function getDaysInMonth(year, monthIndex) {
  return new Date(year, monthIndex + 1, 0).getDate()
}
