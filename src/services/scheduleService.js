import { fetchFromApi } from './apiClient'

export async function fetchScheduleTemplates() {
  const payload = await fetchFromApi('/api/schedules.json', { delayMs: 310 })
  return payload?.templates || { weekday: [], weekend: [] }
}

export async function fetchStudyMethods() {
  const payload = await fetchFromApi('/api/study-tips.json', { delayMs: 290 })
  return Array.isArray(payload?.methods) ? payload.methods : []
}
