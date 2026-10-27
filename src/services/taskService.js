import { fetchFromApi } from './apiClient'
import { addDaysToISO, getTodayISO } from '../utils/dateHelper'

export async function fetchInitialTasks() {
  const todayISO = getTodayISO()
  const payload = await fetchFromApi('/api/tasks.json', { delayMs: 360 })
  const rawList = Array.isArray(payload?.data) ? payload.data : []

  return rawList.map((item, idx) => ({
    id: item.id || Date.now() + idx,
    title: item.title,
    description: item.description || '',
    category: item.category || 'Akademik',
    startDate: item.startDate || addDaysToISO(todayISO, item.startDateOffset ?? 0),
    dueDate: item.dueDate || addDaysToISO(todayISO, item.dueDateOffset ?? 0),
    status: item.status || 'belum',
    urgent: Boolean(item.urgent),
    estimatedMinutes: Number(item.estimatedMinutes || 30),
  }))
}

export async function fetchDailyProductivityQuote() {
  try {
    // Mencoba mengambil kutipan dari Public API eksternal terlebih dahulu
    const externalData = await fetchFromApi('https://dummyjson.com/quotes/random', {
      delayMs: 250,
      timeoutMs: 3500,
    })
    if (externalData && externalData.quote) {
      return {
        id: externalData.id || Date.now(),
        quote: externalData.quote,
        author: externalData.author || 'Anonim',
        tag: 'Public API Quote',
        source: 'dummyjson.com',
      }
    }
  } catch (err) {
    if (err.code === 'SIMULATED_NETWORK_ERROR') {
      throw err
    }
    // Jika offline atau diblokir jaringan kampus, otomatis beralih ke Mock API lokal
  }

  const localPayload = await fetchFromApi('/api/quotes.json', { delayMs: 220 })
  const list = Array.isArray(localPayload?.quotes) ? localPayload.quotes : []
  if (list.length === 0) {
    return {
      id: 1,
      quote: 'Kerjakan tugas dari yang paling mendesak dan cicil sedikit demi sedikit setiap hari.',
      author: 'Tim TugasKu',
      tag: 'Tips Produktif',
      source: 'Local Mock API',
    }
  }
  const randomIndex = Math.floor(Math.random() * list.length)
  return {
    ...list[randomIndex],
    source: 'Local Mock API (/api/quotes.json)',
  }
}
