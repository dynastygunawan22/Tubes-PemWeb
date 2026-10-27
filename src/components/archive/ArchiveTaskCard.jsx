import React from 'react'
import { formatShortDate } from '../../utils/dateHelper'

export function ArchiveTaskCard({ task, onRestore, onDelete }) {
  return (
    <article className="rounded-2xl bg-white/90 border border-slate-200 p-4 flex flex-col justify-between gap-3 shadow-2xs">
      <div className="space-y-1.5">
        <div className="flex items-center justify-between gap-2 text-xs text-[#5b5c59]">
          <span className="px-2.5 py-0.5 rounded-full bg-[#f2f1ec] font-semibold text-[#2e2f2d]">
            {task.category}
          </span>
          <time dateTime={task.dueDate}>Selesai • {formatShortDate(task.dueDate)}</time>
        </div>
        <h3 className="font-semibold text-sm md:text-base text-[#2e2f2d] break-words">
          {task.title}
        </h3>
        {task.description && (
          <p className="text-xs text-[#5b5c59] line-clamp-2">{task.description}</p>
        )}
      </div>

      <div className="flex items-center justify-between pt-2 border-t border-slate-100">
        <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700">
          Selesai
        </span>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onRestore(task.id)}
            className="h-8 px-3 rounded-full bg-pink-100/80 hover:bg-pink-200/80 text-xs font-bold text-[#a7295a] cursor-pointer"
          >
            Restore ke Aktif
          </button>
          <button
            type="button"
            onClick={() => onDelete(task.id)}
            className="h-8 px-3 rounded-full bg-slate-100 hover:bg-red-100 text-xs font-bold text-slate-600 hover:text-red-700 cursor-pointer"
          >
            Hapus
          </button>
        </div>
      </div>
    </article>
  )
}
