import React from 'react'

export function MonthlyStatsCard({ label, value, subtitle, tone = 'neutral', icon = 'insights' }) {
  const toneStyles = {
    primary: 'bg-pink-100/70 text-[#4c0022] border-pink-200',
    teal: 'bg-[#a4f0e9] text-[#005c57] border-teal-200',
    amber: 'bg-[#f7ee96] text-[#5e5810] border-amber-200',
    neutral: 'bg-white text-[#2e2f2d] border-slate-200',
  }

  return (
    <article
      className={`rounded-2xl border p-4 flex flex-col justify-between min-h-[115px] shadow-2xs ${
        toneStyles[tone] || toneStyles.neutral
      }`}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold uppercase tracking-wider opacity-80">{label}</span>
        <span className="material-symbols-outlined text-[20px]" aria-hidden="true">
          {icon}
        </span>
      </div>
      <div className="mt-2">
        <p className="font-headline font-black text-2xl md:text-3xl">{value}</p>
        {subtitle && <p className="text-xs opacity-80 mt-0.5">{subtitle}</p>}
      </div>
    </article>
  )
}
