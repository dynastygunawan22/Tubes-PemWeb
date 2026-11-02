import React, { useState } from 'react'
import { useTugasKu } from '../../context/TugasKuContext'
import { validateCategoryInput } from '../../utils/validators'

const FILTER_ITEMS = [
  { id: 'all', label: 'Semua Tugas', icon: 'list_alt' },
  { id: 'today', label: 'Hari Ini', icon: 'today' },
  { id: 'urgent', label: 'Urgent', icon: 'priority_high' },
  { id: 'progress', label: 'Sedang Dikerjakan', icon: 'pending' },
  { id: 'overdue', label: 'Terlambat', icon: 'event_busy' },
  { id: 'selesai', label: 'Selesai', icon: 'check_circle' },
]

export function SidebarLeft() {
  const {
    activePage,
    navigateTo,
    activeFilter,
    setActiveFilter,
    taskCategoryFilter,
    setTaskCategoryFilter,
    filterCounts,
    categories,
    addCategory,
    removeCategory,
    markAllTasksDone,
    tasks,
  } = useTugasKu()

  const [isAddingCategory, setIsAddingCategory] = useState(false)
  const [categoryInput, setCategoryInput] = useState('')
  const [categoryError, setCategoryError] = useState('')

  const allAlreadyDone = tasks.length > 0 && tasks.every((t) => t.status === 'selesai')

  const handleSelectFilter = (filterId) => {
    setActiveFilter(filterId)
    if (activePage === 'archive' && filterId !== 'selesai') {
      navigateTo('dashboard')
    }
    const feedEl = document.getElementById('task-feed-section')
    if (feedEl) {
      feedEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
    }
  }

  const handleToggleCategoryFilter = (catName) => {
    const nextCat = taskCategoryFilter === catName ? 'all' : catName
    setTaskCategoryFilter(nextCat)
    if (activePage === 'archive') {
      navigateTo('dashboard')
    }
  }

  const handleSaveCategory = (e) => {
    e.preventDefault()
    const check = validateCategoryInput(categoryInput, categories)
    if (!check.isValid) {
      setCategoryError(check.error)
      return
    }
    addCategory(categoryInput)
    setCategoryInput('')
    setCategoryError('')
    setIsAddingCategory(false)
  }

  return (
    <aside
      aria-label="Filter dan Kategori Tugas"
      className="hidden lg:flex w-[280px] shrink-0 sticky top-[65px] h-[calc(100vh-65px)] border-r border-slate-200 bg-slate-50/85 backdrop-blur-xs flex-col p-4 gap-4 overflow-y-auto"
    >
      <section className="px-3 py-1.5 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-headline font-bold text-[#2e2f2d]">Filter Tugas</h2>
          <p className="text-xs text-[#5b5c59]">Kontrol prioritas harian kamu.</p>
        </div>
        {(activeFilter !== 'all' || taskCategoryFilter !== 'all') && (
          <button
            type="button"
            onClick={() => {
              setActiveFilter('all')
              setTaskCategoryFilter('all')
            }}
            className="text-[11px] font-bold text-[#a7295a] hover:underline cursor-pointer"
          >
            Reset
          </button>
        )}
      </section>

      <nav aria-label="Filter status tugas" className="space-y-1 text-sm">
        {FILTER_ITEMS.map((item) => {
          const isActive = activeFilter === item.id
          const countVal = filterCounts?.[item.id] ?? 0
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => handleSelectFilter(item.id)}
              aria-pressed={isActive}
              className={`w-full text-left flex items-center justify-between gap-3 px-4 py-2.5 rounded-full transition-all cursor-pointer ${
                isActive
                  ? 'bg-pink-100/80 text-[#a7295a] font-bold shadow-2xs ring-1 ring-[#a7295a]/20'
                  : 'text-slate-600 hover:bg-slate-200/60'
              }`}
            >
              <span className="flex items-center gap-3 min-w-0">
                <span className="material-symbols-outlined text-[20px]" aria-hidden="true">
                  {item.icon}
                </span>
                <span className="truncate">{item.label}</span>
              </span>
              <span
                className={`text-xs px-2 py-0.5 rounded-full font-bold shrink-0 ${
                  isActive
                    ? 'bg-[#a7295a] text-white'
                    : 'bg-white/85 text-slate-600 border border-slate-200/70'
                }`}
              >
                {countVal}
              </span>
            </button>
          )
        })}
      </nav>

      <section
        aria-labelledby="sidebar-category-heading"
        className="rounded-2xl border border-slate-200 bg-white/85 p-3.5 shadow-2xs"
      >
        <div className="flex items-center justify-between gap-2">
          <div>
            <h3 id="sidebar-category-heading" className="text-sm font-bold text-[#2e2f2d]">
              Kategori Tugas
            </h3>
            <p className="text-[11px] text-[#5b5c59]">Klik kategori untuk memfilter</p>
          </div>
          <button
            type="button"
            onClick={() => {
              setIsAddingCategory((prev) => !prev)
              setCategoryError('')
            }}
            className="text-xs font-semibold text-[#a7295a] hover:underline cursor-pointer shrink-0"
          >
            {isAddingCategory ? 'Tutup' : '+ Tambah'}
          </button>
        </div>

        {isAddingCategory && (
          <form onSubmit={handleSaveCategory} noValidate className="mt-3 space-y-2">
            <label htmlFor="sidebar-category-input" className="sr-only">
              Nama kategori baru
            </label>
            <input
              id="sidebar-category-input"
              type="text"
              value={categoryInput}
              onChange={(e) => {
                setCategoryInput(e.target.value)
                if (categoryError) setCategoryError('')
              }}
              placeholder="Nama kategori..."
              className="w-full h-9 rounded-xl bg-[#f2f1ec] px-3 text-xs border border-transparent focus:border-[#a7295a] focus:bg-white focus:outline-none"
            />
            {categoryError && (
              <p className="text-[11px] text-[#b41340] font-medium">{categoryError}</p>
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
                  setIsAddingCategory(false)
                  setCategoryInput('')
                  setCategoryError('')
                }}
                className="h-8 px-3.5 rounded-full bg-slate-200 text-slate-600 text-xs font-bold cursor-pointer"
              >
                Batal
              </button>
            </div>
          </form>
        )}

        <div className="mt-3 flex flex-wrap gap-1.5">
          {categories.map((cat) => {
            const isCatActive = taskCategoryFilter === cat
            const catCount = tasks.filter((t) => t.category === cat).length
            return (
              <div
                key={cat}
                className={`inline-flex items-center gap-1 pl-3 pr-1.5 py-1 rounded-full text-xs font-semibold transition-all border ${
                  isCatActive
                    ? 'bg-[#a7295a] text-white border-[#a7295a] shadow-2xs'
                    : 'bg-[#f2f1ec] text-[#2e2f2d] border-transparent hover:border-[#a7295a]/30'
                }`}
              >
                <button
                  type="button"
                  onClick={() => handleToggleCategoryFilter(cat)}
                  aria-pressed={isCatActive}
                  title={`Filter kategori ${cat} (${catCount} tugas)`}
                  className="max-w-[115px] truncate text-left cursor-pointer"
                >
                  {cat} ({catCount})
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    removeCategory(cat)
                  }}
                  aria-label={`Hapus kategori ${cat}`}
                  className={`w-4 h-4 rounded-full flex items-center justify-center cursor-pointer ${
                    isCatActive
                      ? 'text-white/80 hover:text-white hover:bg-white/20'
                      : 'text-slate-500 hover:text-[#b41340]'
                  }`}
                >
                  <span className="material-symbols-outlined text-[13px]" aria-hidden="true">
                    close
                  </span>
                </button>
              </div>
            )
          })}
        </div>
      </section>

      <button
        type="button"
        onClick={markAllTasksDone}
        className={`mt-auto h-11 rounded-2xl text-sm font-bold hover:brightness-95 transition-all flex items-center justify-center gap-2 shadow-2xs cursor-pointer ${
          allAlreadyDone
            ? 'bg-[#f7ee96] text-[#5e5810]'
            : 'bg-[#a4f0e9] text-[#005c57]'
        }`}
      >
        <span className="material-symbols-outlined text-[19px]" aria-hidden="true">
          {allAlreadyDone ? 'restart_alt' : 'done_all'}
        </span>
        <span>{allAlreadyDone ? 'Buka Kembali Tugas' : 'Mark All Done'}</span>
      </button>
    </aside>
  )
}
