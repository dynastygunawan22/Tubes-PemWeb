import React from 'react'
import { useTugasKu } from '../../context/TugasKuContext'
import { NAV_PAGES } from './Navbar'

export function Footer() {
  const { navigateTo } = useTugasKu()

  return (
    <footer className="border-t border-slate-200/80 bg-white/75 backdrop-blur-sm text-xs text-[#5b5c59] py-6 px-4 md:px-8 mt-10 mb-16 md:mb-0">
      <div className="max-w-[1480px] mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <p className="font-headline font-bold text-sm text-[#2e2f2d]">
            TugasKu — Aplikasi Manajemen Tugas & Produktivitas Mahasiswa
          </p>
          <p>
            Tugas Besar I (UTS) Perancangan dan Pemrograman Web • Kolaborasi Tim:{' '}
            <strong className="text-[#2e2f2d]">Dynasty, Yosep, Rozi, & Mira</strong>
          </p>
        </div>

        <nav aria-label="Tautan cepat footer" className="flex flex-wrap gap-3">
          {NAV_PAGES.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => navigateTo(item.id)}
              className="hover:text-[#a7295a] hover:underline font-medium cursor-pointer"
            >
              {item.label}
            </button>
          ))}
        </nav>
      </div>
    </footer>
  )
}
