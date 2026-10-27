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
    activeFilter,
    setActiveFilter,
    categories,
    addCategory,
    removeCategory,
    markAllTasksDone,
    tasks,
  } = useTugasKu()

  const [isAddingCategory, setIsAddingCategory] = useState(false)
  const [categoryInput, setCategoryInput] = useState('')
  const [categoryError, setCategoryError] = useState('')

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
      <section className="px-3 py-1.5">
        <h2 className="text-lg font-headline font-bold text-[#2e2f2d]">Filter Tugas</h2>
        <p className="text-xs text-[#5b5c59]">Kontrol prioritas harian kamu.</p>
      </section>

      <nav aria-label="Filter status tugas" className="space-y-1 text-sm">
        {FILTER_ITEMS.map((item) => {
          const isActive = activeFilter === item.id
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setActiveFilter(item.id)}
              aria-pressed={isActive}
              className={`w-full text-left flex items-center justify-between gap-3 px-4 py-2.5 rounded-full transition-all cursor-pointer ${
                isActive
                  ? 'bg-pink-100/75 text-[#a7295a] font-bold shadow-2xs'
                  : 'text-slate-600 hover:bg-slate-200/60'
              }`}
            >
              <span className="flex items-center gap-3">
                <span className="material-symbols-outlined text-[20px]" aria-hidden="true">
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </span>
              {item.id === 'all' && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-white/80 text-slate-600 font-semibold">
                  {tasks.length}
                </span>
              )}
            </button>
          )
        })}
      </nav>

      <section
        aria-labelledby="sidebar-category-heading"
        className="rounded-2xl border border-slate-200 bg-white/80 p-3.5 shadow-2xs"
      >
        <div className="flex items-center justify-between gap-2">
          <h3 id="sidebar-category-heading" className="text-sm font-bold text-[#2e2f2d]">
            Kategori Tugas
          </h3>
          <button
            type="button"
            onClick={() => {
              setIsAddingCategory((prev) => !prev)
              setCategoryError('')
            }}
            className="text-xs font-semibold text-[#a7295a] hover:underline cursor-pointer"
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
          {categories.map((cat) => (
            <div
              key={cat}
              className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#f2f1ec] text-xs font-medium text-[#2e2f2d]"
            >
              <span className="max-w-[120px] truncate">{cat}</span>
              <button
                type="button"
                onClick={() => removeCategory(cat)}
                aria-label={`Hapus kategori ${cat}`}
                className="text-slate-500 hover:text-[#b41340] flex items-center cursor-pointer"
              >
                <span className="material-symbols-outlined text-[14px]" aria-hidden="true">
                  close
                </span>
              </button>
            </div>
          ))}
        </div>
      </section>

      <button
        type="button"
        onClick={markAllTasksDone}
        className="mt-auto h-11 rounded-2xl bg-[#a4f0e9] text-[#005c57] text-sm font-bold hover:brightness-95 transition-all flex items-center justify-center gap-2 shadow-2xs cursor-pointer"
      >
        <span className="material-symbols-outlined text-[19px]" aria-hidden="true">
          done_all
        </span>
        <span>Mark All Done</span>
      </button>
    </aside>
  )
}
