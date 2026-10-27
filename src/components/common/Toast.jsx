import React, { useEffect } from 'react'

export function Toast({ toastMessage, onClose }) {
  useEffect(() => {
    if (!toastMessage) return
    const timer = setTimeout(() => {
      onClose()
    }, 2600)
    return () => clearTimeout(timer)
  }, [toastMessage, onClose])

  if (!toastMessage) return null

  const badgeColors = {
    success: 'bg-emerald-600 text-white',
    error: 'bg-[#b41340] text-white',
    info: 'bg-[#2e2f2d] text-white',
  }

  const iconName =
    toastMessage.type === 'success'
      ? 'check_circle'
      : toastMessage.type === 'error'
      ? 'error'
      : 'notifications'

  return (
    <div
      role="status"
      aria-live="polite"
      className={`fixed right-4 top-20 z-[80] max-w-sm rounded-2xl px-4 py-3 shadow-xl flex items-center gap-2.5 text-xs md:text-sm font-medium transition-all ${
        badgeColors[toastMessage.type] || badgeColors.info
      }`}
    >
      <span className="material-symbols-outlined text-[19px] shrink-0" aria-hidden="true">
        {iconName}
      </span>
      <span className="flex-1 leading-snug">{toastMessage.text}</span>
      <button
        type="button"
        onClick={onClose}
        aria-label="Tutup notifikasi"
        className="w-6 h-6 rounded-full hover:bg-white/20 flex items-center justify-center shrink-0 cursor-pointer"
      >
        <span className="material-symbols-outlined text-[16px]" aria-hidden="true">
          close
        </span>
      </button>
    </div>
  )
}
