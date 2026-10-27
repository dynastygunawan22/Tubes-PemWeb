import React, { useState } from 'react'
import { useTugasKu } from '../../context/TugasKuContext'
import { NAV_PAGES } from './Navbar'

export function MobileNav() {
  const { activePage, navigateTo, openCreateTaskModal } = useTugasKu()
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  const primaryTabs = [
    { id: 'dashboard', label: 'Dashboard', icon: 'dashboard' },
    { id: 'list-tugas', label: 'Tugas', icon: 'list_alt' },
    { id: 'rundown-bulanan', label: 'Rundown', icon: 'calendar_month' },
  ]

  return (
    <>
      {isDrawerOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Menu navigasi lengkap mobile"
          className="md:hidden fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-end"
          onClick={() => setIsDrawerOpen(false)}
        >
          <div
            className="w-full rounded-t-3xl bg-white p-5 pb-24 space-y-4 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-headline font-bold text-base text-[#2e2f2d]">
                Semua Halaman TugasKu
              </h3>
              <button
                type="button"
                onClick={() => setIsDrawerOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2.5">
              {NAV_PAGES.map((item) => {
                const active = activePage === item.id
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      navigateTo(item.id)
                      setIsDrawerOpen(false)
                    }}
                    className={`flex items-center gap-2.5 p-3 rounded-2xl text-left text-xs font-bold transition-all ${
                      active
                        ? 'bg-pink-100 text-[#a7295a]'
                        : 'bg-[#f2f1ec] text-[#2e2f2d]'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
                    <span>{item.label}</span>
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      )}

      <nav
        aria-label="Navigasi Bawah Perangkat Mobile"
        className="md:hidden fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-xl border-t border-slate-200 z-50 flex justify-around items-center px-2 py-2"
      >
        {primaryTabs.slice(0, 2).map((tab) => {
          const active = activePage === tab.id
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => navigateTo(tab.id)}
              className={`flex flex-col items-center gap-0.5 px-2 py-1 ${
                active ? 'text-[#a7295a] font-bold' : 'text-slate-500'
              }`}
            >
              <span className="material-symbols-outlined text-[22px]">{tab.icon}</span>
              <span className="text-[10px] font-semibold">{tab.label}</span>
            </button>
          )
        })}

        <button
          type="button"
          onClick={openCreateTaskModal}
          aria-label="Tambah Tugas Baru Cepat"
          className="-mt-7 w-14 h-14 rounded-full bg-gradient-to-br from-[#a7295a] to-[#ff709f] text-white shadow-lg shadow-[#a7295a]/30 flex items-center justify-center"
        >
          <span className="material-symbols-outlined text-3xl">add</span>
        </button>

        <button
          type="button"
          onClick={() => navigateTo('rundown-bulanan')}
          className={`flex flex-col items-center gap-0.5 px-2 py-1 ${
            activePage === 'rundown-bulanan' ? 'text-[#a7295a] font-bold' : 'text-slate-500'
          }`}
        >
          <span className="material-symbols-outlined text-[22px]">calendar_month</span>
          <span className="text-[10px] font-semibold">Rundown</span>
        </button>

        <button
          type="button"
          onClick={() => setIsDrawerOpen((prev) => !prev)}
          aria-expanded={isDrawerOpen}
          className={`flex flex-col items-center gap-0.5 px-2 py-1 ${
            isDrawerOpen ? 'text-[#a7295a] font-bold' : 'text-slate-500'
          }`}
        >
          <span className="material-symbols-outlined text-[22px]">apps</span>
          <span className="text-[10px] font-semibold">Menu</span>
        </button>
      </nav>
    </>
  )
}
