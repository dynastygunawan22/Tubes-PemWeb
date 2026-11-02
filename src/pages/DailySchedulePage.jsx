import React, { useState } from 'react'
import { useTugasKu } from '../context/TugasKuContext'
import { useFetchData } from '../hooks/useFetchData'
import { fetchScheduleTemplates } from '../services/scheduleService'
import { ScheduleForm } from '../components/schedule/ScheduleForm'
import { SkeletonLoader } from '../components/common/SkeletonLoader'
import { ErrorState } from '../components/common/ErrorState'

export default function DailySchedulePage() {
  const {
    activeScheduleTab,
    setActiveScheduleTab,
    schedules,
    addScheduleItem,
    removeScheduleItem,
    showToast,
  } = useTugasKu()

  const {
    data: apiTemplates,
    isLoading,
    error,
    refetch,
  } = useFetchData(fetchScheduleTemplates, [])

  const [typeFilter, setTypeFilter] = useState('all')

  const currentList = schedules[activeScheduleTab] || []
  const filteredRows = currentList.filter(
    (item) => typeFilter === 'all' || (item.type || 'Belajar Mandiri') === typeFilter
  )

  const handleApplyApiTemplate = () => {
    const templateRows = apiTemplates?.[activeScheduleTab] || []
    if (templateRows.length === 0) return
    templateRows.forEach((row) => {
      addScheduleItem(activeScheduleTab, row)
    })
    showToast('Rekomendasi template jadwal API berhasil ditambahkan.', 'success')
  }

  return (
    <section aria-labelledby="jadwal-harian-heading" className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <h1
            id="jadwal-harian-heading"
            className="text-2xl sm:text-3xl font-headline font-black text-[#2e2f2d]"
          >
            Jadwal Harian & Rutinitas
          </h1>
          <p className="text-xs sm:text-sm text-[#5b5c59] mt-0.5">
            Susun time-blocking harian untuk hari kuliah (Weekday) maupun akhir pekan (Weekend).
          </p>
        </div>

        <div className="inline-flex bg-[#f2f1ec] p-1 rounded-full self-start md:self-auto">
          <button
            type="button"
            onClick={() => setActiveScheduleTab('weekday')}
            className={`h-9 px-4 rounded-full text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeScheduleTab === 'weekday'
                ? 'bg-white text-[#a7295a] shadow-2xs'
                : 'text-[#5b5c59]'
            }`}
          >
            Weekday (Senin–Jumat)
          </button>
          <button
            type="button"
            onClick={() => setActiveScheduleTab('weekend')}
            className={`h-9 px-4 rounded-full text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeScheduleTab === 'weekend'
                ? 'bg-white text-[#a7295a] shadow-2xs'
                : 'text-[#5b5c59]'
            }`}
          >
            Weekend (Sabtu–Minggu)
          </button>
        </div>
      </div>

      <ScheduleForm
        activeTabLabel={activeScheduleTab === 'weekday' ? 'Weekday' : 'Weekend'}
        onAddSchedule={(payload) => addScheduleItem(activeScheduleTab, payload)}
      />

      {/* Filter & Sinkronisasi Template API */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-bold text-[#5b5c59]">Filter Jenis:</span>
          {['all', 'Kuliah', 'Belajar Mandiri', 'Organisasi', 'Perencanaan', 'Personal'].map(
            (typeOpt) => (
              <button
                key={typeOpt}
                type="button"
                onClick={() => setTypeFilter(typeOpt)}
                className={`h-8 px-3 rounded-full text-xs font-bold cursor-pointer ${
                  typeFilter === typeOpt
                    ? 'bg-[#a7295a] text-white'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-[#f2f1ec]'
                }`}
              >
                {typeOpt === 'all' ? 'Semua' : typeOpt}
              </button>
            )
          )}
        </div>

        <button
          type="button"
          onClick={handleApplyApiTemplate}
          disabled={isLoading || Boolean(error)}
          className="h-9 px-4 rounded-full bg-[#a4f0e9] text-[#005c57] text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
        >
          <span className="material-symbols-outlined text-[16px]" aria-hidden="true">
            playlist_add
          </span>
          Muat Rekomendasi Jadwal API
        </button>
      </div>

      {error && (
        <ErrorState
          title="Gagal Memuat Template Jadwal dari API"
          message={error}
          onRetry={refetch}
        />
      )}

      {isLoading ? (
        <SkeletonLoader variant="table" count={4} />
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white/90 shadow-2xs">
          <table className="min-w-[740px] w-full text-sm">
            <thead className="bg-[#f2f1ec] text-left text-xs uppercase tracking-wider text-[#5b5c59]">
              <tr>
                <th className="px-4 py-3.5 w-44">Waktu</th>
                <th className="px-4 py-3.5">Aktivitas & Kegiatan</th>
                <th className="px-4 py-3.5 w-44">Lokasi / Ruang</th>
                <th className="px-4 py-3.5 w-36">Tipe</th>
                <th className="px-4 py-3.5 w-24 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredRows.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-sm text-[#5b5c59]">
                    Belum ada jadwal pada kategori ini. Tambahkan melalui formulir di atas.
                  </td>
                </tr>
              ) : (
                filteredRows.map((row) => (
                  <tr key={row.id} className="border-t border-slate-100 hover:bg-slate-50/80">
                    <td className="px-4 py-3.5 font-headline font-bold text-[#a7295a]">
                      {row.time}
                    </td>
                    <td className="px-4 py-3.5 font-medium text-[#2e2f2d] break-words">
                      {row.activity}
                    </td>
                    <td className="px-4 py-3.5 text-xs text-[#5b5c59]">
                      {row.location || 'Kampus / Kost'}
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="px-2.5 py-1 rounded-full bg-[#f2f1ec] text-xs font-semibold text-[#2e2f2d]">
                        {row.type || 'Belajar Mandiri'}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-center">
                      <button
                        type="button"
                        onClick={() => removeScheduleItem(activeScheduleTab, row.id)}
                        className="px-3 py-1 rounded-full bg-red-100 hover:bg-red-200 text-red-700 text-xs font-bold cursor-pointer"
                      >
                        Hapus
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}
