import React from 'react'
import {
  MONTH_NAMES,
  SHORT_DAY_NAMES,
  getDaysInMonth,
  toISODate,
} from '../../utils/dateHelper'

export function MiniCalendarWidget({
  activeMonth,
  onPrevMonth,
  onNextMonth,
  selectedDateISO,
  onSelectDate,
  todayISO,
  tasks = [],
  notesByDate = {},
}) {
  const currentYear = new Date().getFullYear()
  const firstDayOfMonth = new Date(currentYear, activeMonth, 1)
  const firstWeekday = firstDayOfMonth.getDay()
  const totalDays = getDaysInMonth(currentYear, activeMonth)

  const blankCells = Array.from({ length: firstWeekday }, (_, i) => i)
  const dayNumbers = Array.from({ length: totalDays }, (_, i) => i + 1)

  return (
    <section
      aria-label={`Kalender mini bulan ${MONTH_NAMES[activeMonth]} ${currentYear}`}
      className="rounded-2xl bg-white/90 border border-slate-200 p-4 shadow-2xs"
    >
      <div className="flex items-center justify-between mb-3">
        <button
          type="button"
          onClick={onPrevMonth}
          aria-label="Bulan sebelumnya"
          className="w-8 h-8 rounded-full bg-[#f2f1ec] text-[#5b5c59] hover:bg-[#e4e2de] flex items-center justify-center font-bold cursor-pointer"
        >
          &lt;
        </button>
        <h3 className="font-headline font-bold text-sm text-[#2e2f2d]">
          {MONTH_NAMES[activeMonth]} {currentYear}
        </h3>
        <button
          type="button"
          onClick={onNextMonth}
          aria-label="Bulan berikutnya"
          className="w-8 h-8 rounded-full bg-[#f2f1ec] text-[#5b5c59] hover:bg-[#e4e2de] flex items-center justify-center font-bold cursor-pointer"
        >
          &gt;
        </button>
      </div>

      <div className="grid grid-cols-7 text-[11px] text-center font-semibold text-[#5b5c59] mb-2">
        {SHORT_DAY_NAMES.map((dayName) => (
          <div key={dayName}>{dayName}</div>
        ))}
      </div>

      <div className="tugasku-calendar-grid text-xs">
        {blankCells.map((idx) => (
          <div key={`blank-${idx}`} className="h-8" aria-hidden="true" />
        ))}

        {dayNumbers.map((dayNum) => {
          const iso = toISODate(new Date(currentYear, activeMonth, dayNum))
          const isToday = iso === todayISO
          const isSelected = iso === selectedDateISO
          const hasTask = tasks.some((t) => t.dueDate === iso)
          const hasNote = Boolean(notesByDate[iso])

          return (
            <button
              key={iso}
              type="button"
              onClick={() => onSelectDate(iso)}
              aria-label={`Pilih tanggal ${dayNum} ${MONTH_NAMES[activeMonth]}`}
              aria-pressed={isSelected}
              className={`h-8 rounded-xl text-[11px] flex items-center justify-center relative transition-colors cursor-pointer ${
                isSelected
                  ? 'bg-[#a7295a] text-white font-bold shadow-2xs'
                  : 'bg-[#f8f6f2] hover:bg-[#e9e8e4] text-[#2e2f2d]'
              } ${isToday && !isSelected ? 'ring-1 ring-[#a7295a]/50 font-bold' : ''}`}
            >
              <span>{dayNum}</span>
              {hasTask && (
                <span
                  title="Ada deadline tugas"
                  className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-amber-500"
                />
              )}
              {hasNote && (
                <span
                  title="Ada catatan harian"
                  className="absolute top-0.5 right-0.5 w-1.5 h-1.5 rounded-full bg-emerald-500"
                />
              )}
            </button>
          )
        })}
      </div>

      <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-[#5b5c59]">
        <span className="inline-flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-amber-500" /> Ada Tugas
        </span>
        <span className="inline-flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-emerald-500" /> Ada Catatan
        </span>
      </div>
    </section>
  )
}
