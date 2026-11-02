import React, { useState, useEffect, useMemo } from 'react'
import { useTugasKu } from '../context/TugasKuContext'
import { useFetchData } from '../hooks/useFetchData'
import { fetchRundownEvents } from '../services/rundownService'
import { MonthlyStatsCard } from '../components/rundown/MonthlyStatsCard'
import { SkeletonLoader } from '../components/common/SkeletonLoader'
import { ErrorState } from '../components/common/ErrorState'
import {
  MONTH_NAMES,
  getDaysInMonth,
  toISODate,
  formatLongDate,
  formatShortDate,
} from '../utils/dateHelper'
import { validateNoteInput } from '../utils/validators'

export default function MonthlyRundownPage() {
  const {
    activeMonth,
    changeActiveMonth,
    selectedDateISO,
    setSelectedDateISO,
    tasks,
    notesByDate,
    saveDateNote,
    deleteDateNote,
  } = useTugasKu()

  const {
    data: academicEvents,
    isLoading: isEventsLoading,
    error: eventsError,
    refetch: refetchEvents,
  } = useFetchData(fetchRundownEvents, [])

  const [rundownNoteText, setRundownNoteText] = useState('')
  const [noteFormError, setNoteFormError] = useState('')

  useEffect(() => {
    setRundownNoteText(notesByDate[selectedDateISO] || '')
    setNoteFormError('')
  }, [selectedDateISO, notesByDate])

  const handleSaveNote = (e) => {
    e.preventDefault()
    const check = validateNoteInput(rundownNoteText)
    if (!check.isValid) {
      setNoteFormError(check.error)
      return
    }
    saveDateNote(selectedDateISO, rundownNoteText)
    setNoteFormError('')
  }

  const currentYear = new Date().getFullYear()
  const maxDayInMonth = getDaysInMonth(currentYear, activeMonth)

  const monthlyData = useMemo(() => {
    let total = 0
    let belum = 0
    let progress = 0
    let selesai = 0
    let noteCount = 0

    const rows = []
    for (let day = 1; day <= maxDayInMonth; day += 1) {
      const iso = toISODate(new Date(currentYear, activeMonth, day))
      const dayTasks = tasks.filter((t) => t.dueDate === iso)
      const b = dayTasks.filter((t) => t.status === 'belum').length
      const p = dayTasks.filter((t) => t.status === 'progress').length
      const s = dayTasks.filter((t) => t.status === 'selesai').length
      const note = notesByDate[iso] || ''

      if (note) noteCount += 1
      total += dayTasks.length
      belum += b
      progress += p
      selesai += s

      rows.push({
        day,
        iso,
        totalDayTasks: dayTasks.length,
        belum: b,
        progress: p,
        selesai: s,
        note,
      })
    }

    return {
      rows,
      summary: { total, belum, progress, selesai, noteCount },
    }
  }, [currentYear, activeMonth, maxDayInMonth, tasks, notesByDate])

  return (
    <section aria-labelledby="rundown-bulanan-heading" className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <h1
            id="rundown-bulanan-heading"
            className="text-2xl sm:text-3xl font-headline font-black text-[#2e2f2d]"
          >
            Rundown Bulanan & Kalender
          </h1>
          <p className="text-xs sm:text-sm text-[#5b5c59] mt-0.5">
            Pantau kepadatan tugas harian sepanjang bulan dan simpan catatan penting per tanggal.
          </p>
        </div>

        <div
          role="tablist"
          aria-label="Pilih bulan rundown"
          className="flex flex-wrap gap-1.5"
        >
          {MONTH_NAMES.map((monthName, idx) => {
            const active = idx === activeMonth
            return (
              <button
                key={monthName}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => changeActiveMonth(idx)}
                className={`h-8 px-3 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  active
                    ? 'bg-[#a7295a] text-white shadow-2xs'
                    : 'bg-[#f2f1ec] text-[#5b5c59] hover:bg-[#e4e2de]'
                }`}
              >
                {monthName.slice(0, 3)}
              </button>
            )
          })}
        </div>
      </div>

      {/* Ringkasan Statistik Bulan Aktif */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <MonthlyStatsCard
          label={`Total Tugas (${MONTH_NAMES[activeMonth]})`}
          value={monthlyData.summary.total}
          subtitle="Terjadwal pada bulan ini"
          tone="primary"
          icon="calendar_month"
        />
        <MonthlyStatsCard
          label="Sedang Dikerjakan"
          value={monthlyData.summary.progress}
          subtitle={`${monthlyData.summary.belum} tugas belum dimulai`}
          tone="amber"
          icon="pending_actions"
        />
        <MonthlyStatsCard
          label="Tugas Selesai"
          value={monthlyData.summary.selesai}
          subtitle="Berhasil dituntaskan"
          tone="teal"
          icon="task_alt"
        />
        <MonthlyStatsCard
          label="Catatan Harian"
          value={monthlyData.summary.noteCount}
          subtitle="Hari dengan catatan aktif"
          tone="neutral"
          icon="edit_note"
        />
      </div>

      {/* Agenda Akademik dari Mock API */}
      <section
        aria-labelledby="academic-agenda-heading"
        className="rounded-2xl border border-slate-200 bg-white/90 p-4 space-y-3 shadow-2xs"
      >
        <div className="flex items-center justify-between">
          <h2 id="academic-agenda-heading" className="font-headline font-bold text-base text-[#2e2f2d]">
            Agenda Penting Akademik (API Sync)
          </h2>
          <button
            type="button"
            onClick={refetchEvents}
            className="text-xs font-bold text-[#a7295a] hover:underline inline-flex items-center gap-1 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[15px]" aria-hidden="true">
              refresh
            </span>
            Sinkronkan
          </button>
        </div>

        {eventsError ? (
          <ErrorState
            title="Gagal Memuat Agenda Akademik"
            message={eventsError}
            onRetry={refetchEvents}
          />
        ) : isEventsLoading ? (
          <SkeletonLoader variant="cards" count={2} />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {(academicEvents || []).map((ev) => (
              <article
                key={ev.id}
                className="rounded-xl bg-[#f8f6f2] border border-slate-200/80 p-3.5 flex flex-col justify-between gap-2"
              >
                <div className="flex items-center justify-between text-[11px]">
                  <span className="px-2.5 py-0.5 rounded-full bg-pink-100 text-[#a7295a] font-bold">
                    {ev.type}
                  </span>
                  <time dateTime={ev.dateISO} className="font-semibold text-[#5b5c59]">
                    {formatShortDate(ev.dateISO)}
                  </time>
                </div>
                <p className="text-xs font-bold text-[#2e2f2d]">{ev.title}</p>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* Form Catatan Tanggal Aktif */}
      <section
        aria-labelledby="rundown-note-form-heading"
        className="rounded-2xl border border-slate-200 bg-white/90 p-5 space-y-3 shadow-2xs"
      >
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-2">
          <div>
            <p className="text-xs text-[#5b5c59]">Tanggal aktif terpilih</p>
            <h2 id="rundown-note-form-heading" className="font-headline font-bold text-xl text-[#2e2f2d]">
              {formatLongDate(selectedDateISO)}
            </h2>
          </div>
          <p className="text-xs text-[#5b5c59]">
            Catatan di sini otomatis tersinkronisasi dengan marker hijau pada kalender mini.
          </p>
        </div>

        <form onSubmit={handleSaveNote} noValidate className="space-y-2.5">
          <label htmlFor="rundown-note-input" className="sr-only">
            Catatan untuk tanggal {formatLongDate(selectedDateISO)}
          </label>
          <textarea
            id="rundown-note-input"
            rows={3}
            value={rundownNoteText}
            onChange={(e) => {
              setRundownNoteText(e.target.value)
              if (noteFormError) setNoteFormError('')
            }}
            aria-invalid={Boolean(noteFormError)}
            placeholder="Tulis agenda evaluasi, pengingat asistensi, atau catatan tanggal ini..."
            className="w-full rounded-xl bg-[#f2f1ec] px-4 py-3 text-sm border border-transparent focus:border-[#a7295a] focus:bg-white focus:outline-none resize-y"
          />
          {noteFormError && (
            <p role="alert" className="text-xs text-[#b41340] font-semibold">
              {noteFormError}
            </p>
          )}
          <div className="flex flex-wrap gap-2">
            <button
              type="submit"
              className="h-10 px-5 rounded-full bg-[#a7295a] text-white text-xs md:text-sm font-bold cursor-pointer"
            >
              Simpan Catatan
            </button>
            <button
              type="button"
              onClick={() => {
                deleteDateNote(selectedDateISO)
                setRundownNoteText('')
              }}
              className="h-10 px-5 rounded-full bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs md:text-sm font-bold cursor-pointer"
            >
              Hapus Catatan
            </button>
          </div>
        </form>
      </section>

      {/* Tabel Rundown Bulanan */}
      <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white/90 shadow-2xs">
        <table className="min-w-[920px] w-full text-sm">
          <thead className="bg-[#f2f1ec] text-left text-xs uppercase tracking-wider text-[#5b5c59]">
            <tr>
              <th className="px-4 py-3.5">Hari / Tanggal</th>
              <th className="px-4 py-3.5 text-center">Total Tugas</th>
              <th className="px-4 py-3.5 text-center text-red-600">Belum</th>
              <th className="px-4 py-3.5 text-center text-amber-600">Progress</th>
              <th className="px-4 py-3.5 text-center text-emerald-600">Selesai</th>
              <th className="px-4 py-3.5">Catatan Harian</th>
              <th className="px-4 py-3.5 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {monthlyData.rows.map((row) => {
              const isSelected = row.iso === selectedDateISO
              return (
                <tr
                  key={row.iso}
                  className={`border-t border-slate-100 transition-colors ${
                    isSelected ? 'bg-[#a7295a]/8 font-medium' : 'hover:bg-slate-50/80'
                  }`}
                >
                  <td className="px-4 py-3">
                    <time dateTime={row.iso}>
                      {row.day} {MONTH_NAMES[activeMonth]}
                    </time>
                  </td>
                  <td className="px-4 py-3 text-center font-semibold">{row.totalDayTasks}</td>
                  <td className="px-4 py-3 text-center text-red-600">{row.belum}</td>
                  <td className="px-4 py-3 text-center text-amber-600">{row.progress}</td>
                  <td className="px-4 py-3 text-center text-emerald-600">{row.selesai}</td>
                  <td className="px-4 py-3 max-w-[340px]">
                    <p className="text-xs text-[#5b5c59] truncate">{row.note || '-'}</p>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button
                      type="button"
                      onClick={() => setSelectedDateISO(row.iso)}
                      className={`h-8 px-3.5 rounded-full text-xs font-bold cursor-pointer ${
                        isSelected
                          ? 'bg-[#a7295a] text-white'
                          : 'bg-[#f2f1ec] hover:bg-[#e4e2de] text-[#2e2f2d]'
                      }`}
                    >
                      {isSelected ? 'Aktif' : 'Pilih'}
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
          <tfoot className="bg-[#f2f1ec] font-bold text-xs md:text-sm">
            <tr>
              <td className="px-4 py-3.5">Summary Bulanan</td>
              <td className="px-4 py-3.5 text-center">{monthlyData.summary.total}</td>
              <td className="px-4 py-3.5 text-center text-red-600">{monthlyData.summary.belum}</td>
              <td className="px-4 py-3.5 text-center text-amber-600">
                {monthlyData.summary.progress}
              </td>
              <td className="px-4 py-3.5 text-center text-emerald-600">
                {monthlyData.summary.selesai}
              </td>
              <td className="px-4 py-3.5">
                Total catatan bulan ini: {monthlyData.summary.noteCount}
              </td>
              <td className="px-4 py-3.5 text-center">-</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </section>
  )
}
