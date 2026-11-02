import React, { useState } from 'react'
import { useTugasKu, STATUS_MAP } from '../context/TugasKuContext'
import { SkeletonLoader } from '../components/common/SkeletonLoader'
import { ErrorState } from '../components/common/ErrorState'
import { formatShortDate, isTaskOverdue } from '../utils/dateHelper'
import { validateTaskInput } from '../utils/validators'

export default function DashboardPage() {
  const {
    todayISO,
    categories,
    metrics,
    sidebarFilteredTasks,
    isLoadingTasks,
    apiError,
    retryApiFetch,
    dailyQuote,
    isQuoteLoading,
    quoteError,
    loadQuoteFromApi,
    addTask,
    toggleTaskDone,
    toggleTaskUrgent,
    deleteTask,
    openEditTaskModal,
    navigateTo,
    activeFilter,
    setActiveFilter,
  } = useTugasKu()

  const [quickTitle, setQuickTitle] = useState('')
  const [quickCategory, setQuickCategory] = useState(categories[0] || 'Akademik')
  const [quickDueDate, setQuickDueDate] = useState(todayISO)
  const [quickUrgent, setQuickUrgent] = useState(false)
  const [quickError, setQuickError] = useState('')

  const handleQuickAddSubmit = (e) => {
    e.preventDefault()
    const validation = validateTaskInput({
      title: quickTitle,
      category: quickCategory || categories[0] || 'Akademik',
      startDate: todayISO,
      dueDate: quickDueDate || todayISO,
    })

    if (!validation.isValid) {
      setQuickError(
        validation.errors.title ||
          validation.errors.dueDate ||
          'Mohon periksa kembali input tugas Anda.'
      )
      return
    }

    addTask({
      title: quickTitle,
      category: quickCategory || categories[0] || 'Akademik',
      startDate: todayISO,
      dueDate: quickDueDate || todayISO,
      status: 'belum',
      urgent: quickUrgent,
      estimatedMinutes: 45,
    })

    setQuickTitle('')
    setQuickUrgent(false)
    setQuickError('')
  }

  const displayedTasks = sidebarFilteredTasks.slice(0, 8)

  return (
    <section aria-labelledby="dashboard-main-heading" className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-100/80 text-[#a7295a] text-xs font-bold mb-2">
            <span className="material-symbols-outlined text-[15px]" aria-hidden="true">
              wb_sunny
            </span>
            Ringkasan Produktivitas Mahasiswa
          </span>
          <h1
            id="dashboard-main-heading"
            className="font-headline font-black tracking-tight text-2xl sm:text-3xl lg:text-4xl text-[#2e2f2d]"
          >
            Tugas Hari Ini
          </h1>
          <p className="text-sm md:text-base text-[#5b5c59] mt-1">
            Playful, terstruktur, dan tetap fokus menuntaskan target kuliahmu.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => navigateTo('list-tugas')}
            className="h-9 px-4 rounded-full bg-white border border-slate-200 hover:bg-[#f2f1ec] text-xs font-bold text-[#2e2f2d] inline-flex items-center gap-1.5 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]" aria-hidden="true">
              table_rows
            </span>
            Lihat Tabel Lengkap
          </button>
          <button
            type="button"
            onClick={() => navigateTo('rundown-bulanan')}
            className="h-9 px-4 rounded-full bg-white border border-slate-200 hover:bg-[#f2f1ec] text-xs font-bold text-[#2e2f2d] inline-flex items-center gap-1.5 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]" aria-hidden="true">
              calendar_month
            </span>
            Rundown Bulanan
          </button>
        </div>
      </div>

      {apiError && (
        <ErrorState
          title="Gagal Memuat Data Tugas"
          message={apiError}
          onRetry={retryApiFetch}
        />
      )}

      {isLoadingTasks ? (
        <SkeletonLoader variant="metrics" />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 md:gap-4">
          <article className="rounded-2xl bg-[#a4f0e9] p-4 md:p-5 min-h-[132px] flex flex-col justify-between shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[#005c57]/80">
                Progres Selesai
              </span>
              <span
                className="material-symbols-outlined text-[#005c57]"
                aria-hidden="true"
              >
                auto_graph
              </span>
            </div>
            <div>
              <p className="font-headline font-black text-3xl md:text-4xl text-[#005c57]">
                {metrics.completionRate}%
              </p>
              <p className="text-xs md:text-sm text-[#005c57]/85 mt-0.5">
                {metrics.completed} dari {metrics.total} tugas tuntas
              </p>
            </div>
          </article>

          <article className="rounded-2xl bg-[#f74b6d] p-4 md:p-5 min-h-[132px] flex flex-col justify-between shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[#ffefef]/90">
                Perlu Perhatian
              </span>
              <span
                className="material-symbols-outlined text-[#ffefef]"
                aria-hidden="true"
              >
                priority_high
              </span>
            </div>
            <div>
              <p className="font-headline font-black text-3xl md:text-4xl text-[#ffefef]">
                {metrics.overdue}
              </p>
              <p className="text-xs md:text-sm text-[#ffefef]/90 mt-0.5">
                Tugas melewati deadline ({metrics.urgentCount} urgent aktif)
              </p>
            </div>
          </article>

          <article className="rounded-2xl bg-[#f7ee96] p-4 md:p-5 min-h-[132px] flex flex-col justify-between shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[#5e5810]/85">
                Status Konsistensi
              </span>
              <span
                className="material-symbols-outlined text-[#5e5810]"
                aria-hidden="true"
              >
                workspace_premium
              </span>
            </div>
            <div>
              <p className="font-headline font-black text-3xl md:text-4xl text-[#5e5810]">
                {metrics.consistencyLabel}
              </p>
              <p className="text-xs md:text-sm text-[#5e5810]/85 mt-0.5">
                {metrics.inProgress} tugas sedang dikerjakan
              </p>
            </div>
          </article>

          <article className="rounded-2xl bg-white border border-slate-200 p-4 md:p-5 min-h-[132px] flex flex-col justify-between shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[#5b5c59]">
                Beban Fokus
              </span>
              <span
                className="material-symbols-outlined text-[#a7295a]"
                aria-hidden="true"
              >
                schedule
              </span>
            </div>
            <div>
              <p className="font-headline font-black text-3xl md:text-4xl text-[#2e2f2d]">
                {Math.round((metrics.totalMinutes / 60) * 10) / 10}j
              </p>
              <p className="text-xs md:text-sm text-[#5b5c59] mt-0.5">
                Total estimasi ({metrics.totalMinutes} menit)
              </p>
            </div>
          </article>
        </div>
      )}

      {/* Kutipan Produktivitas dari Public / Mock API */}
      <article
        aria-label="Kutipan motivasi produktivitas harian dari API"
        className="rounded-2xl bg-gradient-to-r from-[#fff5f8] via-white to-[#f2fbf9] border border-pink-200/70 p-4 md:p-5 shadow-2xs"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1 flex-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-[#a7295a]/10 text-[#a7295a] text-[11px] font-bold">
                Inspirasi Harian (API Fetch)
              </span>
              {dailyQuote?.source && (
                <span className="text-[11px] text-[#5b5c59]">
                  Sumber: {dailyQuote.source}
                </span>
              )}
            </div>

            {isQuoteLoading ? (
              <div className="space-y-1.5 pt-1 animate-pulse">
                <div className="h-4 w-4/5 rounded bg-slate-200" />
                <div className="h-3 w-1/3 rounded bg-slate-100" />
              </div>
            ) : quoteError ? (
              <p className="text-xs text-[#b41340] font-medium pt-1">
                {quoteError}
              </p>
            ) : (
              <blockquote className="pt-1">
                <p className="text-sm md:text-base font-medium text-[#2e2f2d] italic">
                  “{dailyQuote?.quote}”
                </p>
                <footer className="text-xs text-[#5b5c59] mt-1 font-semibold">
                  — {dailyQuote?.author}
                </footer>
              </blockquote>
            )}
          </div>

          <button
            type="button"
            onClick={loadQuoteFromApi}
            disabled={isQuoteLoading}
            className="self-start sm:self-center h-9 px-3.5 rounded-full bg-white border border-slate-200 hover:bg-pink-50 text-xs font-bold text-[#a7295a] inline-flex items-center gap-1.5 shrink-0 cursor-pointer disabled:opacity-50"
          >
            <span className="material-symbols-outlined text-[16px]" aria-hidden="true">
              autorenew
            </span>
            <span>Kutipan Baru</span>
          </button>
        </div>
      </article>

      {/* Form Tambah Tugas Cepat */}
      <section
        aria-labelledby="quick-add-heading"
        className="rounded-2xl bg-white/90 border border-slate-200 p-4 md:p-5 space-y-3 shadow-2xs"
      >
        <div className="flex items-center justify-between">
          <h2 id="quick-add-heading" className="text-lg font-headline font-bold text-[#2e2f2d]">
            Tambah Tugas Cepat
          </h2>
          <span className="text-xs text-[#5b5c59]">Input instan dengan validasi otomatis</span>
        </div>

        <form onSubmit={handleQuickAddSubmit} noValidate className="space-y-2.5">
          <div>
            <label htmlFor="quick-task-input" className="sr-only">
              Judul tugas baru
            </label>
            <input
              id="quick-task-input"
              type="text"
              value={quickTitle}
              onChange={(e) => {
                setQuickTitle(e.target.value)
                if (quickError) setQuickError('')
              }}
              aria-invalid={Boolean(quickError)}
              aria-describedby={quickError ? 'quick-task-error' : undefined}
              placeholder="Contoh: Kerjakan revisi laporan praktikum Pemrograman Web..."
              className="h-11 w-full rounded-full bg-[#f2f1ec] px-4 text-sm border border-transparent focus:border-[#a7295a] focus:bg-white focus:outline-none"
            />
            {quickError && (
              <p
                id="quick-task-error"
                role="alert"
                className="text-xs text-[#b41340] font-semibold mt-1.5 pl-3"
              >
                {quickError}
              </p>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <label htmlFor="quick-category-select" className="sr-only">
              Pilih Kategori
            </label>
            <select
              id="quick-category-select"
              value={quickCategory}
              onChange={(e) => setQuickCategory(e.target.value)}
              className="h-11 min-w-[160px] grow sm:grow-0 rounded-full bg-[#f2f1ec] px-4 text-sm border border-transparent focus:border-[#a7295a] focus:bg-white focus:outline-none"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>

            <label htmlFor="quick-due-input" className="sr-only">
              Tanggal Deadline
            </label>
            <input
              id="quick-due-input"
              type="date"
              value={quickDueDate}
              onChange={(e) => setQuickDueDate(e.target.value)}
              className="h-11 min-w-[160px] rounded-full bg-[#f2f1ec] px-4 text-sm border border-transparent focus:border-[#a7295a] focus:bg-white focus:outline-none"
            />

            <label className="h-11 px-4 rounded-full bg-[#f2f1ec] flex items-center justify-center gap-2 text-sm cursor-pointer select-none">
              <input
                type="checkbox"
                checked={quickUrgent}
                onChange={(e) => setQuickUrgent(e.target.checked)}
                className="rounded accent-[#a7295a]"
              />
              <span className="font-medium text-[#2e2f2d]">Urgent</span>
            </label>

            <button
              type="submit"
              className="h-11 px-6 rounded-full bg-[#a7295a] hover:bg-[#8e204b] text-white font-bold text-sm transition-colors cursor-pointer ml-auto sm:ml-0"
            >
              + Tambah
            </button>
          </div>
        </form>
      </section>

      {/* Filter Cepat Mobile/Tablet */}
      <div className="flex lg:hidden items-center gap-2 overflow-x-auto pb-1">
        {[
          { id: 'all', label: 'Semua' },
          { id: 'today', label: 'Hari Ini' },
          { id: 'urgent', label: 'Urgent' },
          { id: 'progress', label: 'On Progress' },
          { id: 'overdue', label: 'Terlambat' },
          { id: 'selesai', label: 'Selesai' },
        ].map((f) => (
          <button
            key={f.id}
            type="button"
            onClick={() => setActiveFilter(f.id)}
            className={`h-8 px-3.5 rounded-full text-xs font-bold whitespace-nowrap ${
              activeFilter === f.id
                ? 'bg-[#a7295a] text-white'
                : 'bg-white border border-slate-200 text-slate-600'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Task Feed */}
      <section aria-labelledby="task-feed-heading" className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <h2 id="task-feed-heading" className="text-lg font-headline font-bold text-[#2e2f2d]">
            Task Feed ({sidebarFilteredTasks.length})
          </h2>
          <span className="text-xs text-[#5b5c59]">
            Filter aktif: <strong className="uppercase">{activeFilter}</strong>
          </span>
        </div>

        {isLoadingTasks ? (
          <SkeletonLoader variant="cards" count={4} />
        ) : displayedTasks.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white/70 p-8 text-center space-y-2">
            <span className="material-symbols-outlined text-4xl text-slate-400" aria-hidden="true">
              task_alt
            </span>
            <p className="font-headline font-bold text-base text-[#2e2f2d]">
              Tidak ada tugas pada filter ini
            </p>
            <p className="text-xs text-[#5b5c59]">
              Tambahkan tugas baru lewat formulir di atas atau ubah filter prioritas di samping.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {displayedTasks.map((task) => {
              const isDone = task.status === 'selesai'
              const overdue = isTaskOverdue(task)
              const statusInfo = STATUS_MAP[task.status] || STATUS_MAP.belum

              return (
                <article
                  key={task.id}
                  className={`rounded-2xl border p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-all shadow-2xs ${
                    isDone
                      ? 'bg-emerald-50/70 border-emerald-200'
                      : overdue
                      ? 'bg-red-50/40 border-red-200'
                      : 'bg-white/90 border-slate-200 hover:border-[#a7295a]/40'
                  }`}
                >
                  <div className="flex items-start gap-3 min-w-0 flex-1">
                    <button
                      type="button"
                      onClick={() => toggleTaskDone(task.id)}
                      aria-label={
                        isDone
                          ? `Tandai tugas ${task.title} belum selesai`
                          : `Tandai tugas ${task.title} selesai`
                      }
                      className={`mt-0.5 w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors cursor-pointer ${
                        isDone
                          ? 'bg-emerald-600 border-emerald-600 text-white'
                          : 'bg-white border-[#a7295a] hover:bg-pink-50'
                      }`}
                    >
                      {isDone && (
                        <span className="material-symbols-outlined text-[15px]" aria-hidden="true">
                          check
                        </span>
                      )}
                    </button>

                    <div className="min-w-0 flex-1">
                      <h3
                        className={`font-semibold text-sm md:text-base break-words ${
                          isDone ? 'line-through text-slate-500' : 'text-[#2e2f2d]'
                        }`}
                      >
                        {task.title}
                      </h3>
                      {task.description && (
                        <p className="text-xs text-[#5b5c59] mt-0.5 line-clamp-2">
                          {task.description}
                        </p>
                      )}
                      <div className="flex flex-wrap items-center gap-2 mt-2 text-xs text-[#5b5c59]">
                        <span className="px-2.5 py-0.5 rounded-full bg-[#f2f1ec] font-medium text-[#2e2f2d]">
                          {task.category}
                        </span>
                        <span>•</span>
                        <time
                          dateTime={task.dueDate}
                          className={overdue ? 'text-[#b41340] font-bold' : ''}
                        >
                          Tenggat: {formatShortDate(task.dueDate)}
                          {overdue ? ' (Terlambat)' : ''}
                        </time>
                        {task.estimatedMinutes && (
                          <>
                            <span>•</span>
                            <span>~{task.estimatedMinutes} mnt</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                    <button
                      type="button"
                      onClick={() => toggleTaskUrgent(task.id)}
                      className={`px-2.5 py-1 rounded-full text-[11px] font-bold cursor-pointer ${
                        task.urgent
                          ? 'bg-[#ff709f]/30 text-[#4c0022] border border-[#a7295a]/30'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {task.urgent ? 'Urgent' : 'Normal'}
                    </button>

                    <span
                      className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${statusInfo.chipClass}`}
                    >
                      {statusInfo.label}
                    </span>

                    <button
                      type="button"
                      onClick={() => openEditTaskModal(task)}
                      aria-label={`Edit tugas ${task.title}`}
                      className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[16px]" aria-hidden="true">
                        edit
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => deleteTask(task.id)}
                      aria-label={`Hapus tugas ${task.title}`}
                      className="w-8 h-8 rounded-full bg-slate-100 hover:bg-red-100 text-slate-500 hover:text-red-600 flex items-center justify-center cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[16px]" aria-hidden="true">
                        close
                      </span>
                    </button>
                  </div>
                </article>
              )
            })}
          </div>
        )}
      </section>
    </section>
  )
}
