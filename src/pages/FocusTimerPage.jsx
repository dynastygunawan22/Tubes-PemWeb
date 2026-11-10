import React from 'react'
import { useTugasKu } from '../context/TugasKuContext'
import { useFetchData } from '../hooks/useFetchData'
import { fetchStudyMethods } from '../services/scheduleService'
import { PomodoroWidget } from '../components/schedule/PomodoroWidget'
import { SkeletonLoader } from '../components/common/SkeletonLoader'
import { ErrorState } from '../components/common/ErrorState'

export default function FocusTimerPage() {
  const { tasks, toggleTaskDone, showToast } = useTugasKu()
  const {
    data: studyMethods,
    isLoading,
    error,
    refetch,
  } = useFetchData(fetchStudyMethods, [])

  const inProgressTasks = tasks.filter((t) => t.status !== 'selesai')

  return (
    <section aria-labelledby="focus-timer-heading" className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1
            id="focus-timer-heading"
            className="text-2xl sm:text-3xl font-headline font-black text-[#2e2f2d]"
          >
            Timer Fokus & Metode Belajar
          </h1>
          <p className="text-xs sm:text-sm text-[#5b5c59] mt-0.5">
            Gunakan teknik Pomodoro untuk menjaga konsentrasi saat mengerjakan tugas kuliah.
          </p>
        </div>

        <button
          type="button"
          onClick={refetch}
          className="self-start sm:self-center h-9 px-4 rounded-full bg-white border border-slate-200 hover:bg-[#f2f1ec] text-xs font-bold text-[#a7295a] inline-flex items-center gap-1.5 cursor-pointer"
        >
          <span className="material-symbols-outlined text-[16px]" aria-hidden="true">
            refresh
          </span>
          Muat Panduan Belajar API
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
        <div className="lg:col-span-3">
          <PomodoroWidget
            activeTasks={inProgressTasks}
            onSessionComplete={() =>
              showToast('Satu sesi Pomodoro selesai! Saatnya istirahat sejenak.', 'success')
            }
          />
        </div>

        <section
          aria-labelledby="focus-queue-heading"
          className="lg:col-span-2 rounded-3xl border border-slate-200 bg-white/90 p-5 space-y-3 shadow-2xs"
        >
          <h2 id="focus-queue-heading" className="font-headline font-bold text-base text-[#2e2f2d]">
            Antrean Tugas Fokus ({inProgressTasks.length})
          </h2>
          {inProgressTasks.length === 0 ? (
            <p className="text-xs text-[#5b5c59]">
              Semua tugas sudah selesai! Tambahkan tugas baru di Dashboard.
            </p>
          ) : (
            <div className="space-y-2.5 max-h-[310px] overflow-y-auto pr-1">
              {inProgressTasks.map((task) => (
                <article
                  key={task.id}
                  className="rounded-2xl bg-[#f8f6f2] border border-slate-200/80 p-3.5 flex items-start justify-between gap-2.5"
                >
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-[#2e2f2d] break-words">{task.title}</p>
                    <p className="text-[11px] text-[#5b5c59] mt-1">
                      {task.category} • ~{task.estimatedMinutes || 30} menit
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => toggleTaskDone(task.id)}
                    className="h-7 px-2.5 rounded-full bg-emerald-100 hover:bg-emerald-200 text-emerald-800 text-[11px] font-bold shrink-0 cursor-pointer"
                  >
                    Selesai
                  </button>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>

      {/* Panduan Metode Belajar dari Mock API */}
      <section aria-labelledby="study-methods-heading" className="space-y-3">
        <h2 id="study-methods-heading" className="font-headline font-bold text-lg text-[#2e2f2d]">
          Rekomendasi Metode Belajar Efektif (Data API)
        </h2>

        {error ? (
          <ErrorState
            title="Gagal Memuat Panduan Belajar"
            message={error}
            onRetry={refetch}
          />
        ) : isLoading ? (
          <SkeletonLoader variant="cards" count={3} />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {(studyMethods || []).map((item) => (
              <article
                key={item.id}
                className="rounded-2xl border border-slate-200 bg-white/90 p-5 space-y-2 shadow-2xs"
              >
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-headline font-bold text-base text-[#2e2f2d]">
                    {item.name}
                  </h3>
                  <span className="px-2.5 py-0.5 rounded-full bg-pink-100 text-[#a7295a] text-[11px] font-bold">
                    {item.duration}
                  </span>
                </div>
                <p className="text-xs text-[#5b5c59] leading-relaxed">{item.description}</p>
              </article>
            ))}
          </div>
        )}
      </section>
    </section>
  )
}
