const SIMULATED_ERROR_KEY = 'tugasku.simulate.api.error'

export function getSimulatedApiError() {
  try {
    return sessionStorage.getItem(SIMULATED_ERROR_KEY) === 'true'
  } catch {
    return false
  }
}

export function setSimulatedApiError(enabled) {
  try {
    if (enabled) {
      sessionStorage.setItem(SIMULATED_ERROR_KEY, 'true')
    } else {
      sessionStorage.removeItem(SIMULATED_ERROR_KEY)
    }
  } catch {
    // Abaikan jika sessionStorage diblokir browser
  }
}

export function waitDelay(ms = 320) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export async function fetchFromApi(endpoint, { delayMs = 320, timeoutMs = 6000, ignoreSimulation = false } = {}) {
  if (delayMs > 0) {
    await waitDelay(delayMs)
  }

  if (!ignoreSimulation && getSimulatedApiError()) {
    const simulatedError = new Error(
      'Gagal terhubung ke server data TugasKu (Simulasi gangguan jaringan aktif). Silakan klik tombol Coba Lagi.'
    )
    simulatedError.code = 'SIMULATED_NETWORK_ERROR'
    throw simulatedError
  }

  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeoutMs)

  try {
    const response = await fetch(endpoint, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
      signal: controller.signal,
    })

    if (!response.ok) {
      throw new Error(`Permintaan ke ${endpoint} gagal dengan kode status HTTP ${response.status}.`)
    }

    const result = await response.json()
    return result
  } catch (err) {
    if (err.name === 'AbortError') {
      throw new Error('Waktu koneksi ke sumber data habis (Request Timeout). Periksa koneksi internet Anda.')
    }
    throw new Error(
      err.message || 'Terjadi kendala saat memuat data dari server. Silakan muat ulang atau coba beberapa saat lagi.'
    )
  } finally {
    clearTimeout(timer)
  }
}
