import React, { useState, useEffect } from 'react'

const MODES = {
  focus: { label: 'Fokus Belajar', minutes: 25, badge: 'bg-pink-100 text-[#a7295a]' },
  shortBreak: { label: 'Istirahat Pendek', minutes: 5, badge: 'bg-[#a4f0e9] text-[#005c57]' },
  longBreak: { label: 'Istirahat Panjang', minutes: 15, badge: 'bg-[#f7ee96] text-[#5e5810]' },
}

export function PomodoroWidget({ activeTasks = [], onSessionComplete }) {
  const [mode, setMode] = useState('focus')
  const [secondsLeft, setSecondsLeft] = useState(MODES.focus.minutes * 60)
  const [isRunning, setIsRunning] = useState(false)
  const [completedSessions, setCompletedSessions] = useState(2)
  const [selectedTaskId, setSelectedTaskId] = useState(activeTasks[0]?.id || '')

  useEffect(() => {
    if (!isRunning) return
    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          setIsRunning(false)
          if (mode === 'focus') {
            setCompletedSessions((c) => c + 1)
            if (onSessionComplete) onSessionComplete()
          }
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(interval)
  }, [isRunning, mode, onSessionComplete])

  const switchMode = (nextMode) => {
    setIsRunning(false)
    setMode(nextMode)
    setSecondsLeft(MODES[nextMode].minutes * 60)
  }

  const resetTimer = () => {
    setIsRunning(false)
    setSecondsLeft(MODES[mode].minutes * 60)
  }

  const mins = String(Math.floor(secondsLeft / 60)).padStart(2, '0')
  const secs = String(secondsLeft % 60).padStart(2, '0')

  return (
    <section
      aria-label="Pengatur waktu fokus Pomodoro"
      className="rounded-3xl border border-slate-200 bg-white/95 p-6 shadow-sm space-y-5"
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="inline-flex bg-[#f2f1ec] p-1 rounded-full">
          {Object.entries(MODES).map(([key, cfg]) => {
            const active = mode === key
            return (
              <button
                key={key}
                type="button"
                onClick={() => switchMode(key)}
                className={`h-9 px-4 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  active ? 'bg-white text-[#a7295a] shadow-2xs' : 'text-[#5b5c59]'
                }`}
              >
                {cfg.label}
              </button>
            )
          })}
        </div>

        <span className="px-3 py-1 rounded-full bg-[#f2f1ec] text-xs font-bold text-[#2e2f2d]">
          Sesi Hari Ini: {completedSessions} Pomodoro
        </span>
      </div>

      <div className="py-6 text-center space-y-3 rounded-2xl bg-[#f8f6f2] border border-slate-200/70">
        <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${MODES[mode].badge}`}>
          {MODES[mode].label}
        </span>

        <div
          role="timer"
          aria-live="off"
          className="font-headline font-black text-5xl sm:text-6xl tracking-tight text-[#2e2f2d]"
        >
          {mins}:{secs}
        </div>

        <div className="max-w-xs mx-auto px-4">
          <label htmlFor="pomodoro-task-select" className="block text-[11px] font-semibold text-[#5b5c59] mb-1">
            Target Tugas Saat Ini:
          </label>
          <select
            id="pomodoro-task-select"
            value={selectedTaskId}
            onChange={(e) => setSelectedTaskId(e.target.value)}
            className="w-full h-9 rounded-xl bg-white px-3 text-xs font-semibold border border-slate-200"
          >
            {activeTasks.length === 0 ? (
              <option value="">Fokus Belajar Umum</option>
            ) : (
              activeTasks.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.title}
                </option>
              ))
            )}
          </select>
        </div>

        <div className="flex items-center justify-center gap-3 pt-2">
          <button
            type="button"
            onClick={() => setIsRunning((prev) => !prev)}
            className="h-11 px-7 rounded-full bg-gradient-to-br from-[#a7295a] to-[#ff709f] text-white font-bold text-sm shadow-md shadow-[#a7295a]/20 cursor-pointer"
          >
            {isRunning ? 'Jeda (Pause)' : 'Mulai Fokus'}
          </button>
          <button
            type="button"
            onClick={resetTimer}
            className="h-11 px-5 rounded-full bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-sm cursor-pointer"
          >
            Reset
          </button>
        </div>
      </div>
    </section>
  )
}
