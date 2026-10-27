import React from 'react'

export function SkeletonLoader({ variant = 'cards', count = 4 }) {
  const items = Array.from({ length: count }, (_, idx) => idx)

  if (variant === 'metrics') {
    return (
      <div
        role="status"
        aria-busy="true"
        aria-label="Sedang memuat ringkasan metrik produktivitas"
        className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 md:gap-4"
      >
        {Array.from({ length: 4 }, (_, i) => (
          <div
            key={i}
            className="rounded-2xl bg-[#e9e8e4]/80 p-5 min-h-[132px] animate-pulse flex flex-col justify-between border border-slate-200/70"
          >
            <div className="w-8 h-8 rounded-full bg-slate-300/70 self-end" />
            <div className="space-y-2">
              <div className="h-8 w-24 rounded-lg bg-slate-300/80" />
              <div className="h-3.5 w-36 rounded bg-slate-300/60" />
            </div>
          </div>
        ))}
        <span className="sr-only">Memuat metrik...</span>
      </div>
    )
  }

  if (variant === 'table') {
    return (
      <div
        role="status"
        aria-busy="true"
        aria-label="Sedang memuat data tabel"
        className="rounded-2xl border border-slate-200 bg-white/85 p-4 space-y-3 animate-pulse"
      >
        <div className="h-10 w-full rounded-xl bg-slate-200/80" />
        {items.map((idx) => (
          <div key={idx} className="grid grid-cols-6 gap-3 py-2 border-t border-slate-100">
            <div className="h-4 rounded bg-slate-200 col-span-2" />
            <div className="h-4 rounded bg-slate-200" />
            <div className="h-4 rounded bg-slate-200" />
            <div className="h-4 rounded bg-slate-200" />
            <div className="h-4 rounded bg-slate-200" />
          </div>
        ))}
        <span className="sr-only">Memuat baris tabel...</span>
      </div>
    )
  }

  return (
    <div
      role="status"
      aria-busy="true"
      aria-label="Sedang memuat daftar tugas dari server"
      className="space-y-3"
    >
      {items.map((idx) => (
        <div
          key={idx}
          className="rounded-2xl border border-slate-200 bg-white/80 p-4 flex items-center gap-3 animate-pulse"
        >
          <div className="w-6 h-6 rounded-full bg-slate-200 shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="h-4 w-3/5 rounded bg-slate-200" />
            <div className="h-3 w-2/5 rounded bg-slate-100" />
          </div>
          <div className="w-20 h-6 rounded-full bg-slate-200 shrink-0" />
        </div>
      ))}
      <span className="sr-only">Sedang mengambil data tugas...</span>
    </div>
  )
}
