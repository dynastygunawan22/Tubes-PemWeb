import React, { useState, useEffect } from 'react'
import { useTugasKu } from '../../context/TugasKuContext'
import { MiniCalendarWidget } from '../rundown/MiniCalendarWidget'
import { formatLongDate, formatShortDate, isTaskOverdue } from '../../utils/dateHelper'
import { validateNoteInput } from '../../utils/validators'

export function SidebarRight() {
  const {
    todayISO,
    activeMonth,
    changeActiveMonth,
    selectedDateISO,
    setSelectedDateISO,
    tasks,
    notesByDate,
    saveDateNote,
    deleteDateNote,
  } = useTugasKu()

  const [noteText, setNoteText] = useState('')
  const [noteError, setNoteError] = useState('')

  useEffect(() => {
    setNoteText(notesByDate[selectedDateISO] || '')
    setNoteError('')
  }, [selectedDateISO, notesByDate])

  const handleSaveSidebarNote = (e) => {
    e.preventDefault()
    const check = validateNoteInput(noteText)
    if (!check.isValid) {
      setNoteError(check.error)
      return
    }
    saveDateNote(selectedDateISO, noteText)
    setNoteError('')
  }

  const upcomingDeadlines = tasks
    .filter((t) => t.status !== 'selesai')
    .sort((a, b) => String(a.dueDate).localeCompare(String(b.dueDate)))
    .slice(0, 5)

  return (
    <aside
      aria-label="Kalender Mini dan Deadline Mendatang"
      className="hidden xl:flex w-[330px] shrink-0 sticky top-[65px] h-[calc(100vh-65px)] border-l border-slate-200 bg-[#f2f1ec]/65 backdrop-blur-xs p-5 flex-col gap-5 overflow-y-auto"
    >
      <MiniCalendarWidget
        activeMonth={activeMonth}
        onPrevMonth={() => changeActiveMonth(activeMonth - 1)}
        onNextMonth={() => changeActiveMonth(activeMonth + 1)}
        selectedDateISO={selectedDateISO}
        onSelectDate={setSelectedDateISO}
        todayISO={todayISO}
        tasks={tasks}
        notesByDate={notesByDate}
      />

      <section
        aria-labelledby="sidebar-calendar-note-heading"
        className="rounded-2xl bg-white/90 border border-slate-200 p-4 space-y-3 shadow-2xs"
      >
        <div>
          <p className="text-xs text-[#5b5c59]">Catatan Kalender</p>
          <h4 id="sidebar-calendar-note-heading" className="font-bold text-sm text-[#2e2f2d]">
            {formatLongDate(selectedDateISO)}
          </h4>
        </div>

        <form onSubmit={handleSaveSidebarNote} noValidate className="space-y-2">
          <label htmlFor="sidebar-note-textarea" className="sr-only">
            Tulis catatan untuk tanggal terpilih
          </label>
          <textarea
            id="sidebar-note-textarea"
            rows={3}
            value={noteText}
            onChange={(e) => {
              setNoteText(e.target.value)
              if (noteError) setNoteError('')
            }}
            placeholder="Tulis note untuk tanggal ini..."
            className="w-full rounded-xl bg-[#f2f1ec] px-3 py-2 text-xs border border-transparent focus:border-[#a7295a] focus:bg-white focus:outline-none resize-y"
          />
          {noteError && (
            <p className="text-[11px] text-[#b41340] font-medium">{noteError}</p>
          )}
          <div className="flex gap-2">
            <button
              type="submit"
              className="h-8 px-3.5 rounded-full bg-[#a7295a] text-white text-xs font-bold cursor-pointer"
            >
              Simpan
            </button>
            <button
              type="button"
              onClick={() => {
                deleteDateNote(selectedDateISO)
                setNoteText('')
              }}
              className="h-8 px-3.5 rounded-full bg-slate-200 text-slate-700 text-xs font-bold cursor-pointer"
            >
              Hapus
            </button>
          </div>
        </form>
      </section>

      <section
        aria-labelledby="sidebar-deadline-heading"
        className="rounded-2xl bg-white/90 border border-slate-200 p-4 space-y-3 shadow-2xs"
      >
        <h3 id="sidebar-deadline-heading" className="font-headline font-bold text-sm text-[#2e2f2d]">
          Deadline Mendatang
        </h3>
        {upcomingDeadlines.length === 0 ? (
          <p className="text-xs text-[#5b5c59]">Tidak ada deadline dekat. Semua aman!</p>
        ) : (
          <div className="space-y-2">
            {upcomingDeadlines.map((t) => {
              const overdue = isTaskOverdue(t)
              return (
                <article key={t.id} className="rounded-xl bg-[#f2f1ec] p-3">
                  <p className="font-semibold text-xs text-[#2e2f2d] break-words">{t.title}</p>
                  <p
                    className={`text-[11px] mt-1 ${
                      overdue ? 'text-[#b41340] font-bold' : 'text-[#5b5c59]'
                    }`}
                  >
                    {formatShortDate(t.dueDate)} {overdue ? '• Terlambat' : ''}
                  </p>
                </article>
              )
            })}
          </div>
        )}
      </section>
    </aside>
  )
}
export default SidebarRight
