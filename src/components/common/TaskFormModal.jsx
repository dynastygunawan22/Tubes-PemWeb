import React, { useState, useEffect } from 'react'
import { validateTaskInput } from '../../utils/validators'
import { getTodayISO } from '../../utils/dateHelper'

export function TaskFormModal({
  isOpen,
  editingTask,
  categories = [],
  onClose,
  onSave,
}) {
  const todayISO = getTodayISO()

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState(categories[0] || 'Akademik')
  const [startDate, setStartDate] = useState(todayISO)
  const [dueDate, setDueDate] = useState(todayISO)
  const [status, setStatus] = useState('belum')
  const [urgent, setUrgent] = useState(false)
  const [estimatedMinutes, setEstimatedMinutes] = useState(45)
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (!isOpen) return
    if (editingTask) {
      setTitle(editingTask.title || '')
      setDescription(editingTask.description || '')
      setCategory(editingTask.category || categories[0] || 'Akademik')
      setStartDate(editingTask.startDate || todayISO)
      setDueDate(editingTask.dueDate || todayISO)
      setStatus(editingTask.status || 'belum')
      setUrgent(Boolean(editingTask.urgent))
      setEstimatedMinutes(editingTask.estimatedMinutes || 45)
    } else {
      setTitle('')
      setDescription('')
      setCategory(categories[0] || 'Akademik')
      setStartDate(todayISO)
      setDueDate(todayISO)
      setStatus('belum')
      setUrgent(false)
      setEstimatedMinutes(45)
    }
    setErrors({})
  }, [isOpen, editingTask, categories, todayISO])

  useEffect(() => {
    if (!isOpen) return
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  if (!isOpen) return null

  const handleSubmit = (e) => {
    e.preventDefault()
    const validation = validateTaskInput({
      title,
      category,
      startDate,
      dueDate,
      estimatedMinutes,
    })

    if (!validation.isValid) {
      setErrors(validation.errors)
      return
    }

    onSave({
      title,
      description,
      category,
      startDate,
      dueDate,
      status,
      urgent,
      estimatedMinutes: Number(estimatedMinutes || 45),
    })
    onClose()
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="task-modal-title"
      className="fixed inset-0 z-[70] bg-slate-900/45 backdrop-blur-xs flex items-center justify-center p-4"
    >
      <div className="w-full max-w-lg rounded-3xl bg-white border border-slate-200 shadow-2xl p-6 space-y-5 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h2 id="task-modal-title" className="text-xl font-headline font-bold text-[#2e2f2d]">
              {editingTask ? 'Edit Detail Tugas' : 'Tambah Tugas Baru'}
            </h2>
            <p className="text-xs text-[#5b5c59]">
              Isi detail target tugas agar progres harianmu tercatat rapi.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup dialog form tugas"
            className="w-9 h-9 rounded-full bg-[#f2f1ec] hover:bg-[#e4e2de] text-[#5b5c59] flex items-center justify-center cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]" aria-hidden="true">
              close
            </span>
          </button>
        </div>

        <form onSubmit={handleSubmit} noValidate className="space-y-4 text-sm">
          <div>
            <label htmlFor="modal-task-title" className="block font-semibold mb-1.5 text-[#2e2f2d]">
              Judul Tugas <span className="text-[#b41340]">*</span>
            </label>
            <input
              id="modal-task-title"
              type="text"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value)
                if (errors.title) setErrors((prev) => ({ ...prev, title: '' }))
              }}
              aria-invalid={Boolean(errors.title)}
              aria-describedby={errors.title ? 'modal-task-title-error' : undefined}
              placeholder="Contoh: Selesaikan integrasi API halaman Rundown"
              className="w-full h-11 rounded-xl bg-[#f2f1ec] px-4 border border-transparent focus:border-[#a7295a] focus:bg-white focus:outline-none"
            />
            {errors.title && (
              <p id="modal-task-title-error" className="text-xs text-[#b41340] mt-1 font-medium">
                {errors.title}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="modal-task-desc" className="block font-semibold mb-1.5 text-[#2e2f2d]">
              Catatan / Deskripsi Singkat
            </label>
            <textarea
              id="modal-task-desc"
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Detail poin-poin yang perlu dikerjakan..."
              className="w-full rounded-xl bg-[#f2f1ec] p-3.5 border border-transparent focus:border-[#a7295a] focus:bg-white focus:outline-none resize-y"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label htmlFor="modal-task-category" className="block font-semibold mb-1.5 text-[#2e2f2d]">
                Kategori <span className="text-[#b41340]">*</span>
              </label>
              <select
                id="modal-task-category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full h-11 rounded-xl bg-[#f2f1ec] px-3.5 border border-transparent focus:border-[#a7295a] focus:bg-white focus:outline-none"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="modal-task-status" className="block font-semibold mb-1.5 text-[#2e2f2d]">
                Status Pengerjaan
              </label>
              <select
                id="modal-task-status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full h-11 rounded-xl bg-[#f2f1ec] px-3.5 border border-transparent focus:border-[#a7295a] focus:bg-white focus:outline-none"
              >
                <option value="belum">Belum Selesai</option>
                <option value="progress">On Progress</option>
                <option value="selesai">Selesai</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label htmlFor="modal-task-start" className="block font-semibold mb-1.5 text-[#2e2f2d]">
                Tanggal Mulai
              </label>
              <input
                id="modal-task-start"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full h-11 rounded-xl bg-[#f2f1ec] px-3.5 border border-transparent focus:border-[#a7295a] focus:bg-white focus:outline-none"
              />
            </div>

            <div>
              <label htmlFor="modal-task-due" className="block font-semibold mb-1.5 text-[#2e2f2d]">
                Tenggat / Deadline <span className="text-[#b41340]">*</span>
              </label>
              <input
                id="modal-task-due"
                type="date"
                value={dueDate}
                onChange={(e) => {
                  setDueDate(e.target.value)
                  if (errors.dueDate) setErrors((prev) => ({ ...prev, dueDate: '' }))
                }}
                aria-invalid={Boolean(errors.dueDate)}
                className="w-full h-11 rounded-xl bg-[#f2f1ec] px-3.5 border border-transparent focus:border-[#a7295a] focus:bg-white focus:outline-none"
              />
              {errors.dueDate && (
                <p className="text-xs text-[#b41340] mt-1 font-medium">{errors.dueDate}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
            <div>
              <label htmlFor="modal-task-duration" className="block font-semibold mb-1.5 text-[#2e2f2d]">
                Estimasi Durasi (Menit)
              </label>
              <input
                id="modal-task-duration"
                type="number"
                min={5}
                max={720}
                value={estimatedMinutes}
                onChange={(e) => setEstimatedMinutes(e.target.value)}
                className="w-full h-11 rounded-xl bg-[#f2f1ec] px-3.5 border border-transparent focus:border-[#a7295a] focus:bg-white focus:outline-none"
              />
              {errors.estimatedMinutes && (
                <p className="text-xs text-[#b41340] mt-1 font-medium">
                  {errors.estimatedMinutes}
                </p>
              )}
            </div>

            <div className="pt-5">
              <label className="h-11 px-4 rounded-xl bg-[#f2f1ec] flex items-center gap-2.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={urgent}
                  onChange={(e) => setUrgent(e.target.checked)}
                  className="w-4 h-4 rounded accent-[#a7295a]"
                />
                <span className="font-semibold text-[#2e2f2d]">Tandai Prioritas Urgent</span>
              </label>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="h-10 px-5 rounded-full bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs md:text-sm cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              className="h-10 px-6 rounded-full bg-gradient-to-br from-[#a7295a] to-[#ff709f] text-white font-bold text-xs md:text-sm shadow-md shadow-[#a7295a]/20 cursor-pointer"
            >
              {editingTask ? 'Simpan Perubahan' : 'Tambahkan Tugas'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
