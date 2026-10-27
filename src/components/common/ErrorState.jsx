import React from 'react'

export function ErrorState({
  title = 'Gagal Memuat Data dari Server API',
  message = 'Terjadi gangguan jaringan saat mengambil data. Silakan periksa koneksi Anda atau coba muat ulang.',
  onRetry,
}) {
  return (
    <section
      role="alert"
      aria-live="assertive"
      className="rounded-2xl border border-[#f74b6d]/40 bg-[#ffefef] p-5 md:p-6 text-[#4c0022] shadow-sm"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-[#b41340] text-white flex items-center justify-center shrink-0 mt-0.5">
            <span className="material-symbols-outlined text-[24px]" aria-hidden="true">
              cloud_off
            </span>
          </div>
          <div className="space-y-1">
            <h3 className="font-headline font-bold text-base md:text-lg text-[#b41340]">
              {title}
            </h3>
            <p className="text-xs md:text-sm text-[#4c0022]/85 leading-relaxed max-w-2xl">
              {message}
            </p>
          </div>
        </div>

        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="inline-flex items-center justify-center gap-2 h-10 px-5 rounded-full bg-[#b41340] hover:bg-[#910e33] text-white text-xs md:text-sm font-bold transition-all shadow-sm shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#b41340]"
          >
            <span className="material-symbols-outlined text-[18px]" aria-hidden="true">
              refresh
            </span>
            Coba Lagi
          </button>
        )}
      </div>
    </section>
  )
}
