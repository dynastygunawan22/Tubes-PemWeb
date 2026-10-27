import React, { useState, useMemo } from 'react'
import { useTugasKu } from '../context/TugasKuContext'
import { useFetchData } from '../hooks/useFetchData'
import { fetchCategoryGuides } from '../services/settingsService'
import { ArchiveTaskCard } from '../components/archive/ArchiveTaskCard'
import { CategoryManagerCard } from '../components/archive/CategoryManagerCard'
import { SkeletonLoader } from '../components/common/SkeletonLoader'
import { ErrorState } from '../components/common/ErrorState'

export default function ArchivePage() {
  const {
    tasks,
    categories,
    restoreArchivedTask,
    deleteTask,
    clearCompletedTasks,
    addCategory,
    removeCategory,
  } = useTugasKu()

  const {
    data: categoryGuides,
    isLoading,
    error,
    refetch,
  } = useFetchData(fetchCategoryGuides, [])

  const [archiveQuery, setArchiveQuery] = useState('')
  const [selectedCat, setSelectedCat] = useState('all')

  const completedTasks = useMemo(() => {
    const q = archiveQuery.trim().toLowerCase()
    return tasks.filter((t) => {
      if (t.status !== 'selesai') return false
      const matchText = !q || `${t.title} ${t.category}`.toLowerCase().includes(q)
      const matchCat = selectedCat === 'all' || t.category === selectedCat
      return matchText && matchCat
    })
  }, [tasks, archiveQuery, selectedCat])

  return (
    <section aria-labelledby="archive-page-heading" className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <h1
            id="archive-page-heading"
            className="text-2xl sm:text-3xl font-headline font-black text-[#2e2f2d]"
          >
            Archive & Manajemen Kategori
          </h1>
          <p className="text-xs sm:text-sm text-[#5b5c59] mt-0.5">
            Daftar riwayat tugas yang sudah selesai dan pengaturan kategori aktivitas mahasiswa.
          </p>
        </div>

        {completedTasks.length > 0 && (
          <button
            type="button"
            onClick={clearCompletedTasks}
            className="self-start md:self-auto h-10 px-4 rounded-full bg-red-100 hover:bg-red-200 text-red-700 text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]" aria-hidden="true">
              delete_sweep
            </span>
            Bersihkan Semua Arsip
          </button>
        )}
      </div>

      {/* Manajemen Kategori */}
      <CategoryManagerCard
        categories={categories}
        onAddCategory={addCategory}
        onRemoveCategory={removeCategory}
      />

      {/* Panduan Kuota Kategori dari Mock API */}
      <section aria-labelledby="category-guide-heading" className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 id="category-guide-heading" className="font-headline font-bold text-lg text-[#2e2f2d]">
            Panduan Alokasi Waktu Kategori (Data API)
          </h2>
          <button
            type="button"
            onClick={refetch}
            className="text-xs font-bold text-[#a7295a] hover:underline cursor-pointer"
          >
            Muat Ulang
          </button>
        </div>

        {error ? (
          <ErrorState
            title="Gagal Memuat Panduan Kategori"
            message={error}
            onRetry={refetch}
          />
        ) : isLoading ? (
          <SkeletonLoader variant="cards" count={2} />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {(categoryGuides || []).map((item) => (
              <article
                key={item.name}
                className="rounded-2xl border border-slate-200 bg-white/90 p-4 flex flex-col justify-between gap-2 shadow-2xs"
              >
                <div>
                  <span
                    className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold ${item.badgeColor}`}
                  >
                    {item.name}
                  </span>
                  <p className="text-xs text-[#5b5c59] mt-2 leading-relaxed">
                    {item.description}
                  </p>
                </div>
                <p className="text-xs font-bold text-[#2e2f2d] pt-2 border-t border-slate-100">
                  Rekomendasi: ~{item.recommendedWeeklyHours} jam/minggu
                </p>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* Filter & Daftar Tugas di Archive */}
      <section aria-labelledby="archived-tasks-heading" className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h2 id="archived-tasks-heading" className="font-headline font-bold text-lg text-[#2e2f2d]">
            Daftar Tugas Selesai ({completedTasks.length})
          </h2>

          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="search"
              value={archiveQuery}
              onChange={(e) => setArchiveQuery(e.target.value)}
              placeholder="Cari di arsip..."
              className="h-9 rounded-full bg-white border border-slate-200 px-3.5 text-xs focus:border-[#a7295a] focus:outline-none"
            />
            <select
              value={selectedCat}
              onChange={(e) => setSelectedCat(e.target.value)}
              className="h-9 rounded-full bg-white border border-slate-200 px-3 text-xs focus:border-[#a7295a] focus:outline-none"
            >
              <option value="all">Semua Kategori</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>

        {completedTasks.length === 0 ? (
          <div className="rounded-2xl bg-white/80 border border-dashed border-slate-300 p-8 text-center text-sm text-[#5b5c59]">
            Belum ada data tugas selesai pada arsip ini.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {completedTasks.map((task) => (
              <ArchiveTaskCard
                key={task.id}
                task={task}
                onRestore={restoreArchivedTask}
                onDelete={deleteTask}
              />
            ))}
          </div>
        )}
      </section>
    </section>
  )
}
