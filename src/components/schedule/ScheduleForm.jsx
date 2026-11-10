import React, { useState } from 'react'
import { validateScheduleInput } from '../../utils/validators'

const ACTIVITY_TYPES = ['Kuliah', 'Belajar Mandiri', 'Organisasi', 'Perencanaan', 'Personal']

export function ScheduleForm({ onAddSchedule, activeTabLabel }) {
  const [time, setTime] = useState('')
  const [activity, setActivity] = useState('')
  const [location, setLocation] = useState('')
  const [type, setType] = useState('Belajar Mandiri')
  const [errors, setErrors] = useState({})

  const handleSubmit = (e) => {
    e.preventDefault()
    const check = validateScheduleInput({ time, activity, location })
    if (!check.isValid) {
      setErrors(check.errors)
      return
    }

    onAddSchedule({
      time,
      activity,
      location: location || 'Kampus / Kost',
      type,
    })

    setTime('')
    setActivity('')
    setLocation('')
    setErrors({})
  }

  return (
    <section
      aria-labelledby="schedule-form-heading"
      className="rounded-2xl border border-slate-200 bg-white/90 p-5 space-y-3 shadow-2xs"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
        <h2 id="schedule-form-heading" className="font-headline font-bold text-base text-[#2e2f2d]">
          Input Blok Jadwal Baru ({activeTabLabel})
        </h2>
        <span className="text-xs text-[#5b5c59]">Format jam: HH.MM - HH.MM</span>
      </div>

      <form onSubmit={handleSubmit} noValidate className="space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-2.5">
          <div>
            <label htmlFor="schedule-time-input" className="block text-xs font-bold text-[#5b5c59] mb-1">
              Rentang Waktu <span className="text-[#b41340]">*</span>
            </label>
            <input
              id="schedule-time-input"
              type="text"
              value={time}
              onChange={(e) => {
                setTime(e.target.value)
                if (errors.time) setErrors((prev) => ({ ...prev, time: '' }))
              }}
              aria-invalid={Boolean(errors.time)}
              placeholder="07.00 - 08.30"
              className="h-10 w-full rounded-xl bg-[#f2f1ec] px-3.5 text-sm border border-transparent focus:border-[#a7295a] focus:bg-white focus:outline-none"
            />
          </div>

          <div className="md:col-span-2">
            <label htmlFor="schedule-activity-input" className="block text-xs font-bold text-[#5b5c59] mb-1">
              Nama Aktivitas / Kegiatan <span className="text-[#b41340]">*</span>
            </label>
            <input
              id="schedule-activity-input"
              type="text"
              value={activity}
              onChange={(e) => {
                setActivity(e.target.value)
                if (errors.activity) setErrors((prev) => ({ ...prev, activity: '' }))
              }}
              aria-invalid={Boolean(errors.activity)}
              placeholder="Contoh: Belajar mandiri struktur komponen React"
              className="h-10 w-full rounded-xl bg-[#f2f1ec] px-3.5 text-sm border border-transparent focus:border-[#a7295a] focus:bg-white focus:outline-none"
            />
          </div>

          <div>
            <label htmlFor="schedule-type-select" className="block text-xs font-bold text-[#5b5c59] mb-1">
              Jenis Kegiatan
            </label>
            <select
              id="schedule-type-select"
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="h-10 w-full rounded-xl bg-[#f2f1ec] px-3 text-sm border border-transparent focus:border-[#a7295a] focus:bg-white focus:outline-none"
            >
              {ACTIVITY_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
          <div className="flex-1">
            <label htmlFor="schedule-location-input" className="sr-only">
              Lokasi kegiatan
            </label>
            <input
              id="schedule-location-input"
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Lokasi / Ruangan (opsional, misal: Lab Komputer / Kamar Kost)"
              className="h-10 w-full rounded-xl bg-[#f2f1ec] px-3.5 text-xs md:text-sm border border-transparent focus:border-[#a7295a] focus:bg-white focus:outline-none"
            />
          </div>

          <button
            type="submit"
            className="h-10 px-6 rounded-full bg-[#a7295a] hover:bg-[#8e204b] text-white text-xs md:text-sm font-bold shrink-0 cursor-pointer"
          >
            + Tambah ke Jadwal
          </button>
        </div>

        {(errors.time || errors.activity || errors.location) && (
          <div role="alert" className="rounded-xl bg-red-50 border border-red-200 px-3.5 py-2 text-xs text-[#b41340] space-y-0.5">
            {errors.time && <p>• {errors.time}</p>}
            {errors.activity && <p>• {errors.activity}</p>}
            {errors.location && <p>• {errors.location}</p>}
          </div>
        )}
      </form>
    </section>
  )
}
