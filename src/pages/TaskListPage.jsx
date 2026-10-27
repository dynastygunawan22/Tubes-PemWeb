import React, { useState, useMemo } from 'react'
import { useTugasKu, STATUS_MAP } from '../context/TugasKuContext'
import { SkeletonLoader } from '../components/common/SkeletonLoader'
import { ErrorState } from '../components/common/ErrorState'
import { formatShortDate, isTaskOverdue } from '../utils/dateHelper'
import { exportToJSONFile, exportTasksToCSVFile } from '../utils/exportHelper'

export default function TaskListPage() {
  const {
    tableFilteredTasks,
    categories,
    searchQuery,
    setSearchQuery,
    taskStatusFilter,
    setTaskStatusFilter,
    taskCategoryFilter,
    setTaskCategoryFilter,
    isLoadingTasks,
    apiError,
    retryApiFetch,
    updateTask,
    toggleTaskDone,
    toggleTaskUrgent,
    deleteTask,
    openCreateTaskModal,
    openEditTaskModal,
    showToast,
  } = useTugasKu()

  const [sortBy, setSortBy] = useState('dueDate')

  const sortedTasks = useMemo(() => {
    const copy = [...tableFilteredTasks]
    copy.sort((a, b) => {
      if (sortBy === 'urgent') {
        return Number(b.urgent) - Number(a.urgent)
      }
      if (sortBy === 'title') {
        return String(a.title).localeCompare(String(b.title), 'id')
      }
      return String(a.dueDate || '').localeCompare(String(b.dueDate || ''))
    })
    return copy
  }, [tableFilteredTasks, sortBy])

  const handleExportJSON = () => {
    exportToJSONFile(sortedTasks, 'tugasku-daftar-tugas.json')
    showToast('Data tugas berhasil diekspor ke format JSON.', 'success')
  }

  const handleExportCSV = () => {
    exportTasksToCSVFile(sortedTasks, 'tugasku-daftar-tugas.csv')
    showToast('Data tugas berhasil diekspor ke format CSV.', 'success')
  }

  return (
    <section aria-labelledby="list-tugas-heading" className="space-y-5">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <h1
            id="list-tugas-heading"
            className="text-2xl sm:text-3xl font-headline font-black text-[#2e2f2d]"
          >
            List Tugas Lengkap
          </h1>
          <p className="text-xs sm:text-sm text-[#5b5c59] mt-0.5">
            Kelola status, prioritas, filter kategori, dan ekspor data tugas kuliahmu.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handleExportJSON}
            className="h-10 px-4 rounded-full bg-[#e9e8e4] hover:bg-[#deddd8] text-xs font-bold text-[#2e2f2d] inline-flex items-center gap-1.5 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]" aria-hidden="true">
              download
            </span>
            Export JSON
          </button>
          <button
            type="button"
            onClick={handleExportCSV}
            className="h-10 px-4 rounded-full bg-[#e9e8e4] hover:bg-[#deddd8] text-xs font-bold text-[#2e2f2d] inline-flex items-center gap-1.5 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]" aria-hidden="true">
              table_view
            </span>
            Export CSV
          </button>
          <button
            type="button"
            onClick={openCreateTaskModal}
            className="h-10 px-4 rounded-full bg-[#a7295a] text-white text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]" aria-hidden="true">
              add
            </span>
            Tambah Tugas
          </button>
        </div>
      </div>

      {/* Bar Pencarian & Filter */}
      <div className="rounded-2xl bg-white/85 border border-slate-200 p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 shadow-2xs">
        <div>
          <label htmlFor="task-search-input" className="block text-xs font-bold text-[#5b5c59] mb-1">
            Cari Judul / Kata Kunci
          </label>
          <input
            id="task-search-input"
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Ketik nama tugas..."
            className="h-10 w-full rounded-xl bg-[#f2f1ec] px-3.5 text-sm border border-transparent focus:border-[#a7295a] focus:bg-white focus:outline-none"
          />
        </div>

        <div>
          <label htmlFor="task-status-filter" className="block text-xs font-bold text-[#5b5c59] mb-1">
            Filter Status
          </label>
          <select
            id="task-status-filter"
            value={taskStatusFilter}
            onChange={(e) => setTaskStatusFilter(e.target.value)}
            className="h-10 w-full rounded-xl bg-[#f2f1ec] px-3 text-sm border border-transparent focus:border-[#a7295a] focus:bg-white focus:outline-none"
          >
            <option value="all">Semua Status</option>
            <option value="belum">Belum Selesai</option>
            <option value="progress">On Progress</option>
            <option value="selesai">Selesai</option>
          </select>
        </div>

        <div>
          <label htmlFor="task-category-filter" className="block text-xs font-bold text-[#5b5c59] mb-1">
            Filter Kategori
          </label>
          <select
            id="task-category-filter"
            value={taskCategoryFilter}
            onChange={(e) => setTaskCategoryFilter(e.target.value)}
            className="h-10 w-full rounded-xl bg-[#f2f1ec] px-3 text-sm border border-transparent focus:border-[#a7295a] focus:bg-white focus:outline-none"
          >
            <option value="all">Semua Kategori</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="task-sort-select" className="block text-xs font-bold text-[#5b5c59] mb-1">
            Urutkan Berdasarkan
          </label>
          <select
            id="task-sort-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="h-10 w-full rounded-xl bg-[#f2f1ec] px-3 text-sm border border-transparent focus:border-[#a7295a] focus:bg-white focus:outline-none"
          >
            <option value="dueDate">Deadline Terdekat</option>
            <option value="urgent">Prioritas Urgent</option>
            <option value="title">Abjad Judul (A-Z)</option>
          </select>
        </div>
      </div>

      {apiError && (
        <ErrorState
          title="Gagal Memuat Tabel Tugas"
          message={apiError}
          onRetry={retryApiFetch}
        />
      )}

      {isLoadingTasks ? (
        <SkeletonLoader variant="table" count={5} />
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white/90 shadow-2xs">
          <table className="min-w-[960px] w-full text-sm">
            <thead className="bg-[#f2f1ec] text-left text-xs uppercase tracking-wider text-[#5b5c59]">
              <tr>
                <th className="px-4 py-3.5">No</th>
                <th className="px-4 py-3.5">Tugas & Deskripsi</th>
                <th className="px-4 py-3.5">Kategori</th>
                <th className="px-4 py-3.5">Mulai</th>
                <th className="px-4 py-3.5">Deadline</th>
                <th className="px-4 py-3.5 text-center">Selesai</th>
                <th className="px-4 py-3.5 text-center">Urgent</th>
                <th className="px-4 py-3.5">Status</th>
                <th className="px-4 py-3.5 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {sortedTasks.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-4 py-8 text-center text-sm text-[#5b5c59]">
                    Data tugas tidak ditemukan untuk kombinasi pencarian/filter saat ini.
                  </td>
                </tr>
              ) : (
                sortedTasks.map((task, idx) => {
                  const overdue = isTaskOverdue(task)
                  const isDone = task.status === 'selesai'
                  return (
                    <tr
                      key={task.id}
                      className={`border-t border-slate-100 transition-colors ${
                        isDone ? 'bg-emerald-50/40' : 'hover:bg-slate-50/80'
                      }`}
                    >
                      <td className="px-4 py-3.5 font-semibold text-slate-500">{idx + 1}</td>
                      <td className="px-4 py-3.5 max-w-[320px]">
                        <p
                          className={`font-semibold break-words ${
                            isDone ? 'line-through text-slate-400' : 'text-[#2e2f2d]'
                          }`}
                        >
                          {task.title}
                        </p>
                        {task.description && (
                          <p className="text-xs text-[#5b5c59] mt-0.5 line-clamp-1">
                            {task.description}
                          </p>
                        )}
                      </td>
                      <td className="px-4 py-3.5">
                        <span className="px-2.5 py-1 rounded-full bg-[#f2f1ec] text-xs font-semibold">
                          {task.category}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-xs text-[#5b5c59]">
                        <time dateTime={task.startDate}>{formatShortDate(task.startDate)}</time>
                      </td>
                      <td className="px-4 py-3.5 text-xs">
                        <time
                          dateTime={task.dueDate}
                          className={overdue ? 'text-[#b41340] font-bold' : 'text-[#2e2f2d]'}
                        >
                          {formatShortDate(task.dueDate)}
                        </time>
                      </td>
                      <td className="px-4 py-3.5 text-center">
                        <input
                          type="checkbox"
                          aria-label={`Tandai selesai ${task.title}`}
                          checked={isDone}
                          onChange={() => toggleTaskDone(task.id)}
                          className="w-4 h-4 rounded accent-[#a7295a] cursor-pointer"
                        />
                      </td>
                      <td className="px-4 py-3.5 text-center">
                        <input
                          type="checkbox"
                          aria-label={`Tandai urgent ${task.title}`}
                          checked={Boolean(task.urgent)}
                          onChange={() => toggleTaskUrgent(task.id)}
                          className="w-4 h-4 rounded accent-[#a7295a] cursor-pointer"
                        />
                      </td>
                      <td className="px-4 py-3.5">
                        <select
                          aria-label={`Status tugas ${task.title}`}
                          value={task.status}
                          onChange={(e) => updateTask(task.id, { status: e.target.value })}
                          className="w-full h-9 rounded-xl bg-[#f2f1ec] px-2.5 text-xs font-semibold border border-transparent focus:border-[#a7295a] focus:bg-white focus:outline-none"
                        >
                          {Object.entries(STATUS_MAP).map(([key, val]) => (
                            <option key={key} value={key}>
                              {val.label}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => openEditTaskModal(task)}
                            className="px-2.5 py-1 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold cursor-pointer"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => deleteTask(task.id)}
                            className="px-2.5 py-1 rounded-full bg-red-100 hover:bg-red-200 text-red-700 text-xs font-semibold cursor-pointer"
                          >
                            Hapus
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}
