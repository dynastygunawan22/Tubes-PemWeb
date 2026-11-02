import { fetchFromApi } from './apiClient'
import { addDaysToISO, getTodayISO } from '../utils/dateHelper'

export async function fetchRundownEvents() {
  const todayISO = getTodayISO()
  const payload = await fetchFromApi('/api/rundown-notes.json', { delayMs: 300 })
  const events = Array.isArray(payload?.academicEvents) ? payload.academicEvents : []

  return events.map((ev) => ({
    ...ev,
    dateISO: addDaysToISO(todayISO, ev.dayOffset ?? 0),
  }))
}

export async function fetchAnalyticsData() {
  const payload = await fetchFromApi('/api/analytics.json', { delayMs: 340 })
  return {
    weeklyTrend: Array.isArray(payload?.weeklyTrend) ? payload.weeklyTrend : [],
    insights: Array.isArray(payload?.insights) ? payload.insights : [],
  }
}
