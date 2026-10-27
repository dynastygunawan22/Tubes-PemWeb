export function validateTaskInput({ title, category, startDate, dueDate, estimatedMinutes }) {
  const errors = {}
  const cleanTitle = String(title || '').trim()

  if (!cleanTitle) {
    errors.title = 'Judul tugas wajib diisi terlebih dahulu.'
  } else if (cleanTitle.length < 3) {
    errors.title = 'Judul tugas minimal terdiri dari 3 karakter.'
  } else if (cleanTitle.length > 140) {
    errors.title = 'Judul tugas maksimal 140 karakter agar tetap ringkas.'
  }

  if (!category || String(category).trim() === '') {
    errors.category = 'Pilih salah satu kategori tugas.'
  }

  if (!dueDate) {
    errors.dueDate = 'Tanggal tenggat (deadline) wajib ditentukan.'
  } else if (startDate && dueDate < startDate) {
    errors.dueDate = 'Tanggal deadline tidak boleh lebih awal dari tanggal mulai.'
  }

  if (estimatedMinutes !== undefined && estimatedMinutes !== '') {
    const num = Number(estimatedMinutes)
    if (Number.isNaN(num) || num < 5 || num > 720) {
      errors.estimatedMinutes = 'Estimasi durasi harus di antara 5 hingga 720 menit.'
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  }
}

export function validateCategoryInput(name, existingCategories = []) {
  const clean = String(name || '').trim()
  if (!clean) {
    return { isValid: false, error: 'Nama kategori tidak boleh kosong.' }
  }
  if (clean.length < 3) {
    return { isValid: false, error: 'Nama kategori minimal 3 karakter.' }
  }
  if (clean.length > 28) {
    return { isValid: false, error: 'Nama kategori maksimal 28 karakter.' }
  }
  const isDuplicate = existingCategories.some(
    (cat) => String(typeof cat === 'string' ? cat : cat.name).toLowerCase() === clean.toLowerCase()
  )
  if (isDuplicate) {
    return { isValid: false, error: 'Kategori tersebut sudah terdaftar.' }
  }
  return { isValid: true, error: '' }
}

export function validateScheduleInput({ time, activity, location }) {
  const errors = {}
  const cleanTime = String(time || '').trim()
  const cleanActivity = String(activity || '').trim()

  const timePattern = /^([01]?\d|2[0-3])[.:][0-5]\d\s*-\s*([01]?\d|2[0-3])[.:][0-5]\d$/
  if (!cleanTime) {
    errors.time = 'Rentang waktu wajib diisi (contoh: 07.00 - 08.30).'
  } else if (!timePattern.test(cleanTime)) {
    errors.time = 'Format jam belum sesuai. Gunakan format seperti 07.00 - 08.30.'
  }

  if (!cleanActivity) {
    errors.activity = 'Nama aktivitas harian wajib diisi.'
  } else if (cleanActivity.length < 3) {
    errors.activity = 'Nama aktivitas minimal 3 karakter.'
  }

  if (location && String(location).trim().length > 60) {
    errors.location = 'Nama lokasi/ruangan maksimal 60 karakter.'
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  }
}

export function validateNoteInput(noteText) {
  const clean = String(noteText || '').trim()
  if (!clean) {
    return { isValid: false, error: 'Isi catatan tanggal tidak boleh kosong.' }
  }
  if (clean.length < 4) {
    return { isValid: false, error: 'Catatan minimal berisi 4 karakter.' }
  }
  if (clean.length > 500) {
    return { isValid: false, error: 'Catatan maksimal 500 karakter.' }
  }
  return { isValid: true, error: '' }
}
