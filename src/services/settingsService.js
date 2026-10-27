import { fetchFromApi } from './apiClient'

export async function fetchCategoryGuides() {
  const payload = await fetchFromApi('/api/categories.json', { delayMs: 280 })
  return Array.isArray(payload?.categories) ? payload.categories : []
}

export async function fetchTeamAndSystemInfo() {
  const payload = await fetchFromApi('/api/profile-settings.json', { delayMs: 300 })
  return {
    course: payload?.course || 'Perancangan dan Pemrograman Web',
    repository: payload?.repository || 'https://github.com/dynastygunawan22/Tubes-PemWeb.git',
    teamMembers: Array.isArray(payload?.teamMembers) ? payload.teamMembers : [],
  }
}
