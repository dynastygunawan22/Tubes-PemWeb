import React, { useMemo } from 'react'
import { useTugasKu } from '../context/TugasKuContext'
import { useFetchData } from '../hooks/useFetchData'
import { fetchAnalyticsData } from '../services/rundownService'
import { SkeletonLoader } from '../components/common/SkeletonLoader'
import { ErrorState } from '../components/common/ErrorState'

export default function AnalyticsPage() {
  const { tasks, categories, metrics } = useTugasKu()
  const {
    data: analyticsData,
    isLoading,
    error,
    refetch,
  } = useFetchData(fetchAnalyticsData, [])

  const categoryDistribution = useMemo(() => {
    const total = tasks.length || 1
    return categories.map((catName) => {
      const catTasks = tasks.filter((t) => t.category === catName)
      const doneCount = catTasks.filter((t) => t.status === 'selesai').length
      const percentage = Math.round((catTasks.length / total) * 100)
      const completionPct =
        catTasks.length > 0 ? Math.round((doneCount / catTasks.length) * 100) : 0
      return {
        name: catName,
        total: catTasks.length,
        doneCount,
        percentage,
        completionPct,
      }
    })
  }, [tasks, categories])

  const eisenhowerMatrix = useMemo(() => {
    const activeTasks = tasks.filter((t) => t.status !== 'selesai')
    return {
      doFirst: activeTasks.filter((t) => t.urgent && t.status === 'progress'),
      scheduleNext: activeTasks.filter((t) => t.urgent && t.status === 'belum'),
      delegateOrSteady: activeTasks.filter((t) => !t.urgent && t.status === 'progress'),
      backlog: activeTasks.filter((t) => !t.urgent && t.status === 'belum'),
    }
  }, [tasks])

  return (
    <section aria-labelledby="analytics-page-heading" className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1
            id="analytics-page-heading"
            className="text-2xl sm:text-3xl font-headline font-black text-[#2e2f2d]"
          >
            Analitik & Distribusi Produktivitas
          </h1>
          <p className="text-xs sm:text-sm text-[#5b5c59] mt-0.5">
            Evaluasi beban kerja per kategori, matriks prioritas Eisenhower, dan tren penyelesaian mingguan.
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
          Muat Ulang Analitik API
        </button>
      </div>

      {error && (
        <ErrorState
          title="Gagal Memuat Data Analitik Mingguan"
          message={error}
          onRetry={refetch}
        />
      )}

      {/* Distribusi Tugas per Kategori */}
      <section
        aria-labelledby="category-breakdown-heading"
        className="rounded-2xl border border-slate-200 bg-white/90 p-5 space-y-4 shadow-2xs"
      >
        <div className="flex items-center justify-between">
          <h2 id="category-breakdown-heading" className="font-headline font-bold text-lg text-[#2e2f2d]">
            Distribusi & Ketuntasan per Kategori
          </h2>
          <span className="text-xs text-[#5b5c59]">Total {metrics.total} Tugas</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {categoryDistribution.map((item) => (
            <article
              key={item.name}
              className="rounded-xl bg-[#f8f6f2] border border-slate-200/70 p-4 space-y-2.5"
            >
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-sm text-[#2e2f2d]">{item.name}</h3>
                <span className="text-xs font-semibold text-[#a7295a]">
                  {item.doneCount}/{item.total} Selesai ({item.completionPct}%)
                </span>
              </div>

              <div
                role="progressbar"
                aria-valuenow={item.completionPct}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label={`Progres kategori ${item.name}`}
                className="w-full h-2.5 rounded-full bg-slate-200 overflow-hidden"
              >
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#a7295a] to-[#ff709f] transition-all duration-300"
                  style={{ width: `${item.completionPct}%` }}
                />
              </div>

              <p className="text-[11px] text-[#5b5c59]">
                Mencakup {item.percentage}% dari keseluruhan daftar tugas Anda.
              </p>
            </article>
          ))}
        </div>
      </section>

      {/* Tren Mingguan dari API */}
      <section
        aria-labelledby="weekly-trend-heading"
        className="rounded-2xl border border-slate-200 bg-white/90 p-5 space-y-4 shadow-2xs"
      >
        <h2 id="weekly-trend-heading" className="font-headline font-bold text-lg text-[#2e2f2d]">
          Grafik Tren Penyelesaian 7 Hari Terakhir (Data API)
        </h2>

        {isLoading ? (
          <SkeletonLoader variant="cards" count={3} />
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5 pt-2">
              {(analyticsData?.weeklyTrend || []).map((dayItem) => {
                const ratio = Math.min(
                  100,
                  Math.round((dayItem.completed / (dayItem.target || 1)) * 100)
                )
                return (
                  <article
                    key={dayItem.day}
                    className="rounded-2xl bg-[#f2f1ec] p-3.5 flex flex-col items-center text-center gap-2"
                  >
                    <span className="text-xs font-bold text-[#2e2f2d]">{dayItem.day}</span>
                    <div className="w-full h-24 bg-white rounded-xl p-1.5 flex items-end justify-center border border-slate-200/60">
                      <div
                        className="w-8 rounded-lg bg-gradient-to-t from-[#0d6661] to-[#a4f0e9] transition-all"
                        style={{ height: `${Math.max(18, ratio)}%` }}
                        title={`${dayItem.completed} tugas selesai`}
                      />
                    </div>
                    <div>
                      <p className="text-xs font-extrabold text-[#005c57]">
                        {dayItem.completed}/{dayItem.target} Tugas
                      </p>
                      <p className="text-[10px] text-[#5b5c59]">{dayItem.focusMinutes} mnt</p>
                    </div>
                  </article>
                )
              })}
            </div>

            <div className="rounded-xl bg-[#f7ee96]/45 border border-amber-200/80 p-4 space-y-1.5">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#5e5810]">
                Ringkasan Evaluasi Mingguan
              </h3>
              <ul className="list-disc list-inside text-xs text-[#2e2f2d] space-y-1">
                {(analyticsData?.insights || []).map((insight, idx) => (
                  <li key={idx}>{insight}</li>
                ))}
              </ul>
            </div>
          </>
        )}
      </section>

      {/* Matriks Prioritas Eisenhower */}
      <section
        aria-labelledby="matrix-heading"
        className="rounded-2xl border border-slate-200 bg-white/90 p-5 space-y-4 shadow-2xs"
      >
        <h2 id="matrix-heading" className="font-headline font-bold text-lg text-[#2e2f2d]">
          Matriks Prioritas Tugas Aktif
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <article className="rounded-2xl bg-red-50/70 border border-red-200 p-4 space-y-2">
            <h3 className="font-bold text-sm text-[#b41340]">
              1. Urgent & Sedang Dikerjakan ({eisenhowerMatrix.doFirst.length})
            </h3>
            {eisenhowerMatrix.doFirst.length === 0 ? (
              <p className="text-xs text-[#5b5c59]">Tidak ada tugas mendesak yang sedang berjalan.</p>
            ) : (
              <ul className="text-xs space-y-1.5 text-[#2e2f2d]">
                {eisenhowerMatrix.doFirst.map((t) => (
                  <li key={t.id} className="font-medium">• {t.title}</li>
                ))}
              </ul>
            )}
          </article>

          <article className="rounded-2xl bg-amber-50/70 border border-amber-200 p-4 space-y-2">
            <h3 className="font-bold text-sm text-amber-900">
              2. Urgent & Belum Dimulai ({eisenhowerMatrix.scheduleNext.length})
            </h3>
            {eisenhowerMatrix.scheduleNext.length === 0 ? (
              <p className="text-xs text-[#5b5c59]">Semua tugas urgent sudah mulai dicicil.</p>
            ) : (
              <ul className="text-xs space-y-1.5 text-[#2e2f2d]">
                {eisenhowerMatrix.scheduleNext.map((t) => (
                  <li key={t.id} className="font-medium">• {t.title}</li>
                ))}
              </ul>
            )}
          </article>

          <article className="rounded-2xl bg-teal-50/70 border border-teal-200 p-4 space-y-2">
            <h3 className="font-bold text-sm text-[#005c57]">
              3. Normal & Sedang Berjalan ({eisenhowerMatrix.delegateOrSteady.length})
            </h3>
            {eisenhowerMatrix.delegateOrSteady.length === 0 ? (
              <p className="text-xs text-[#5b5c59]">Belum ada tugas reguler berstatus progress.</p>
            ) : (
              <ul className="text-xs space-y-1.5 text-[#2e2f2d]">
                {eisenhowerMatrix.delegateOrSteady.map((t) => (
                  <li key={t.id} className="font-medium">• {t.title}</li>
                ))}
              </ul>
            )}
          </article>

          <article className="rounded-2xl bg-slate-50 border border-slate-200 p-4 space-y-2">
            <h3 className="font-bold text-sm text-slate-700">
              4. Antrean Rencana / Backlog ({eisenhowerMatrix.backlog.length})
            </h3>
            {eisenhowerMatrix.backlog.length === 0 ? (
              <p className="text-xs text-[#5b5c59]">Antrean backlog kosong.</p>
            ) : (
              <ul className="text-xs space-y-1.5 text-[#2e2f2d]">
                {eisenhowerMatrix.backlog.map((t) => (
                  <li key={t.id} className="font-medium">• {t.title}</li>
                ))}
              </ul>
            )}
          </article>
        </div>
      </section>
    </section>
  )
}
