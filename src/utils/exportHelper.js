export function exportToJSONFile(payload, filename = 'tugasku-export.json') {
  const content = JSON.stringify(
    {
      exportedAt: new Date().toISOString(),
      app: 'TugasKu Productivity Web App',
      version: '1.0.0',
      data: payload,
    },
    null,
    2
  )

  const blob = new Blob([content], { type: 'application/json;charset=utf-8' })
  triggerBrowserDownload(blob, filename)
}

export function exportTasksToCSVFile(tasks = [], filename = 'tugasku-daftar-tugas.csv') {
  const headers = ['No', 'Judul Tugas', 'Kategori', 'Tanggal Mulai', 'Deadline', 'Urgent', 'Status', 'Estimasi (Menit)']
  const rows = tasks.map((t, index) => [
    index + 1,
    `"${String(t.title || '').replace(/"/g, '""')}"`,
    `"${String(t.category || '').replace(/"/g, '""')}"`,
    t.startDate || '-',
    t.dueDate || '-',
    t.urgent ? 'Ya' : 'Tidak',
    t.status || 'belum',
    t.estimatedMinutes || 30,
  ])

  const csvString = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n')
  const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' })
  triggerBrowserDownload(blob, filename)
}

function triggerBrowserDownload(blob, filename) {
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}
