import React, { useState } from 'react'
import { validateCategoryInput } from '../../utils/validators'

export function CategoryManagerCard({ categories = [], onAddCategory, onRemoveCategory }) {
  const [name, setName] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    const check = validateCategoryInput(name, categories)
    if (!check.isValid) {
      setError(check.error)
      return
    }
    onAddCategory(name)
    setName('')
    setError('')
  }

  return (
    <section
      aria-labelledby="category-manager-heading"
      className="rounded-2xl border border-slate-200 bg-white/90 p-5 space-y-4 shadow-2xs"
    >
      <div>
        <h2 id="category-manager-heading" className="font-headline font-bold text-base text-[#2e2f2d]">
          Kelola Kategori Tugas
        </h2>
        <p className="text-xs text-[#5b5c59]">
          Tambahkan kategori kustom untuk mengelompokkan tugas kuliah atau organisasi.
        </p>
      </div>

      <form onSubmit={handleSubmit} noValidate className="flex flex-col sm:flex-row gap-2">
        <div className="flex-1">
          <label htmlFor="archive-new-category" className="sr-only">
            Nama kategori baru
          </label>
          <input
            id="archive-new-category"
            type="text"
            value={name}
            onChange={(e) => {
              setName(e.target.value)
              if (error) setError('')
            }}
            aria-invalid={Boolean(error)}
            placeholder="Contoh: Skripsi / Kepanitiaan / Magang..."
            className="h-10 w-full rounded-full bg-[#f2f1ec] px-4 text-sm border border-transparent focus:border-[#a7295a] focus:bg-white focus:outline-none"
          />
          {error && <p className="text-xs text-[#b41340] font-semibold mt-1 pl-3">{error}</p>}
        </div>
        <button
          type="submit"
          className="h-10 px-5 rounded-full bg-[#a7295a] text-white text-xs md:text-sm font-bold shrink-0 cursor-pointer"
        >
          + Tambah Kategori
        </button>
      </form>

      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => (
          <div
            key={cat}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#f2f1ec] text-xs font-bold text-[#2e2f2d]"
          >
            <span>{cat}</span>
            <button
              type="button"
              onClick={() => onRemoveCategory(cat)}
              aria-label={`Hapus kategori ${cat}`}
              className="text-slate-500 hover:text-[#b41340] cursor-pointer"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </section>
  )
}
