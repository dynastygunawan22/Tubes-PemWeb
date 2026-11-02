import React from 'react'
import { useTugasKu } from '../../context/TugasKuContext'

export const NAV_PAGES = [
  { id: 'dashboard', label: 'Dashboard', icon: 'dashboard', owner: 'Dynasty' },
  { id: 'list-tugas', label: 'List Tugas', icon: 'list_alt', owner: 'Dynasty' },
  { id: 'rundown-bulanan', label: 'Rundown Bulanan', icon: 'calendar_month', owner: 'Yosep' },
  { id: 'analitik', label: 'Analitik', icon: 'monitoring', owner: 'Yosep' },
  { id: 'jadwal-harian', label: 'Jadwal Harian', icon: 'schedule', owner: 'Rozi' },
  { id: 'fokus-timer', label: 'Timer Fokus', icon: 'timer', owner: 'Rozi' },
  { id: 'archive', label: 'Archive', icon: 'inventory_2', owner: 'Mira' },
  { id: 'settings', label: 'Settings', icon: 'settings', owner: 'Mira' },
]

export function Navbar() {
  const {
    activePage,
    navigateTo,
    openCreateTaskModal,
    simulateErrorMode,
    toggleSimulateApiError,
    settings,
  } = useTugasKu()

  const initialLetter = (settings?.studentName || 'Dynasty').trim().charAt(0).toUpperCase()

  return (
    <header className="sticky top-0 z-50 bg-white/85 backdrop-blur-xl border-b border-slate-200/80">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[90] focus:px-4 focus:py-2 focus:rounded-full focus:bg-[#a7295a] focus:text-white focus:font-bold focus:text-xs"
      >
        Lewati ke konten utama
      </a>

      <div className="max-w-[1480px] mx-auto px-4 md:px-6 py-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-4 lg:gap-6 min-w-0">
          <button
            type="button"
            onClick={() => navigateTo('dashboard')}
            aria-label="Kembali ke beranda TugasKu"
            className="flex items-center gap-2 text-left shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-[#a7295a] rounded-lg"
          >
            <span className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#a7295a] to-[#ff709f] text-white font-headline font-black text-lg flex items-center justify-center shadow-sm shadow-[#a7295a]/25">
              T
            </span>
            <span className="text-2xl font-black tracking-tight text-[#a7295a] font-headline">
              TugasKu
            </span>
          </button>

          <nav
            aria-label="Navigasi Halaman Utama"
            className="hidden md:flex items-center gap-1 lg:gap-2 text-xs lg:text-sm font-semibold overflow-x-auto py-1"
          >
            {NAV_PAGES.map((page) => {
              const isActive = activePage === page.id
              return (
                <button
                  key={page.id}
                  type="button"
                  onClick={() => navigateTo(page.id)}
                  aria-current={isActive ? 'page' : undefined}
                  className={`px-3 py-1.5 rounded-full transition-all whitespace-nowrap cursor-pointer ${
                    isActive
                      ? 'bg-pink-100/80 text-[#a7295a] font-bold shadow-2xs'
                      : 'text-slate-600 hover:text-[#a7295a] hover:bg-slate-100/70'
                  }`}
                >
                  {page.label}
                </button>
              )
            })}
          </nav>
        </div>

        <div className="flex items-center gap-2 md:gap-2.5 shrink-0">
          <button
            type="button"
            onClick={toggleSimulateApiError}
            title="Uji coba tampilan Error State & Retry API"
            aria-pressed={simulateErrorMode}
            className={`hidden sm:inline-flex items-center gap-1.5 h-9 px-3.5 rounded-full text-xs font-bold transition-all cursor-pointer border ${
              simulateErrorMode
                ? 'bg-[#b41340] text-white border-[#b41340]'
                : 'bg-[#f2f1ec] text-[#5b5c59] border-slate-200 hover:bg-[#e4e2de]'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]" aria-hidden="true">
              {simulateErrorMode ? 'cloud_off' : 'cloud_done'}
            </span>
            <span>{simulateErrorMode ? 'Simulasi Error: ON' : 'API Normal'}</span>
          </button>

          <button
            type="button"
            onClick={openCreateTaskModal}
            className="h-10 px-4 md:px-5 rounded-full bg-gradient-to-br from-[#a7295a] to-[#ff709f] text-white font-bold text-xs md:text-sm shadow-md shadow-[#a7295a]/20 hover:brightness-105 transition-all inline-flex items-center gap-1.5 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]" aria-hidden="true">
              add
            </span>
            <span>Tugas Baru</span>
          </button>

          <button
            type="button"
            onClick={() => navigateTo('settings')}
            aria-label="Buka halaman pengaturan"
            className="w-10 h-10 rounded-full bg-[#f2f1ec] text-[#5b5c59] hover:bg-[#e4e2de] transition-colors flex items-center justify-center cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]" aria-hidden="true">
              settings
            </span>
          </button>

          <button
            type="button"
            onClick={() => navigateTo('settings')}
            title={`Profil: ${settings?.studentName || 'Dynasty'}`}
            aria-label={`Profil mahasiswa ${settings?.studentName || 'Dynasty'}`}
            className="w-10 h-10 rounded-full border-2 border-[#a7295a]/25 bg-pink-100 text-[#a7295a] font-bold flex items-center justify-center cursor-pointer"
          >
            {initialLetter}
          </button>
        </div>
      </div>
    </header>
  )
}
