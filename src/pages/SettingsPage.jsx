import React, { useState, useEffect } from 'react'
import { useTugasKu } from '../context/TugasKuContext'
import { useFetchData } from '../hooks/useFetchData'
import { fetchTeamAndSystemInfo } from '../services/settingsService'
import { SkeletonLoader } from '../components/common/SkeletonLoader'
import { ErrorState } from '../components/common/ErrorState'

export default function SettingsPage() {
  const {
    settings,
    updateSettings,
    resetAllDataToDefault,
    simulateErrorMode,
    toggleSimulateApiError,
  } = useTugasKu()

  const {
    data: systemInfo,
    isLoading,
    error,
    refetch,
  } = useFetchData(fetchTeamAndSystemInfo, [])

  const [studentName, setStudentName] = useState(settings.studentName || '')
  const [studentNim, setStudentNim] = useState(settings.studentNim || '')
  const [studentClass, setStudentClass] = useState(settings.studentClass || '')
  const [dailyTargetTasks, setDailyTargetTasks] = useState(settings.dailyTargetTasks || 5)
  const [formError, setFormError] = useState('')

  useEffect(() => {
    setStudentName(settings.studentName || '')
    setStudentNim(settings.studentNim || '')
    setStudentClass(settings.studentClass || '')
    setDailyTargetTasks(settings.dailyTargetTasks || 5)
  }, [settings])

  const handleProfileSave = (e) => {
    e.preventDefault()
    if (!studentName.trim() || studentName.trim().length < 3) {
      setFormError('Nama mahasiswa minimal 3 karakter.')
      return
    }
    if (!studentNim.trim() || studentNim.trim().length < 5) {
      setFormError('NIM wajib diisi dengan benar.')
      return
    }
    const targetNum = Number(dailyTargetTasks)
    if (Number.isNaN(targetNum) || targetNum < 1 || targetNum > 25) {
      setFormError('Target tugas harian harus bernilai antara 1 hingga 25.')
      return
    }

    setFormError('')
    updateSettings({
      studentName: studentName.trim(),
      studentNim: studentNim.trim(),
      studentClass: studentClass.trim() || 'SE-07-02',
      dailyTargetTasks: targetNum,
    })
  }

  return (
    <section aria-labelledby="settings-page-heading" className="space-y-6">
      <div>
        <h1
          id="settings-page-heading"
          className="text-2xl sm:text-3xl font-headline font-black text-[#2e2f2d]"
        >
          Settings & Profil Mahasiswa
        </h1>
        <p className="text-xs sm:text-sm text-[#5b5c59] mt-0.5">
          Atur identitas pengguna, pengingat tenggat waktu, serta informasi tim pengembang TugasKu.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Form Profil Mahasiswa */}
        <article className="rounded-2xl border border-slate-200 bg-white/90 p-5 space-y-4 shadow-2xs">
          <h2 className="font-headline font-bold text-base text-[#2e2f2d]">
            Profil & Target Harian
          </h2>

          <form onSubmit={handleProfileSave} noValidate className="space-y-3 text-sm">
            <div>
              <label htmlFor="settings-name" className="block text-xs font-bold text-[#5b5c59] mb-1">
                Nama Lengkap Mahasiswa
              </label>
              <input
                id="settings-name"
                type="text"
                value={studentName}
                onChange={(e) => {
                  setStudentName(e.target.value)
                  if (formError) setFormError('')
                }}
                className="h-10 w-full rounded-xl bg-[#f2f1ec] px-3.5 text-sm border border-transparent focus:border-[#a7295a] focus:bg-white focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label htmlFor="settings-nim" className="block text-xs font-bold text-[#5b5c59] mb-1">
                  NIM
                </label>
                <input
                  id="settings-nim"
                  type="text"
                  value={studentNim}
                  onChange={(e) => {
                    setStudentNim(e.target.value)
                    if (formError) setFormError('')
                  }}
                  className="h-10 w-full rounded-xl bg-[#f2f1ec] px-3.5 text-sm border border-transparent focus:border-[#a7295a] focus:bg-white focus:outline-none"
                />
              </div>

              <div>
                <label htmlFor="settings-class" className="block text-xs font-bold text-[#5b5c59] mb-1">
                  Kelas
                </label>
                <input
                  id="settings-class"
                  type="text"
                  value={studentClass}
                  onChange={(e) => setStudentClass(e.target.value)}
                  className="h-10 w-full rounded-xl bg-[#f2f1ec] px-3.5 text-sm border border-transparent focus:border-[#a7295a] focus:bg-white focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label htmlFor="settings-target" className="block text-xs font-bold text-[#5b5c59] mb-1">
                Target Penyelesaian Tugas Harian
              </label>
              <input
                id="settings-target"
                type="number"
                min={1}
                max={25}
                value={dailyTargetTasks}
                onChange={(e) => setDailyTargetTasks(e.target.value)}
                className="h-10 w-full rounded-xl bg-[#f2f1ec] px-3.5 text-sm border border-transparent focus:border-[#a7295a] focus:bg-white focus:outline-none"
              />
            </div>

            {formError && (
              <p role="alert" className="text-xs text-[#b41340] font-semibold">
                {formError}
              </p>
            )}

            <button
              type="submit"
              className="h-10 px-5 rounded-full bg-[#a7295a] text-white text-xs md:text-sm font-bold cursor-pointer"
            >
              Simpan Profil
            </button>
          </form>
        </article>

        {/* Preferensi & Kontrol Data */}
        <div className="space-y-4">
          <article className="rounded-2xl border border-slate-200 bg-white/90 p-5 space-y-3 shadow-2xs">
            <h2 className="font-headline font-bold text-base text-[#2e2f2d]">
              Notifikasi & Preferensi
            </h2>

            <label className="flex items-center justify-between py-2 text-sm border-b border-slate-100 cursor-pointer">
              <span>Reminder deadline H-1</span>
              <input
                type="checkbox"
                checked={Boolean(settings.reminderHMinus1)}
                onChange={(e) => updateSettings({ reminderHMinus1: e.target.checked })}
                className="w-4 h-4 rounded accent-[#a7295a]"
              />
            </label>

            <label className="flex items-center justify-between py-2 text-sm border-b border-slate-100 cursor-pointer">
              <span>Reminder prioritas urgent</span>
              <input
                type="checkbox"
                checked={Boolean(settings.reminderUrgent)}
                onChange={(e) => updateSettings({ reminderUrgent: e.target.checked })}
                className="w-4 h-4 rounded accent-[#a7295a]"
              />
            </label>

            <div className="pt-1">
              <label htmlFor="settings-lang" className="block text-xs font-bold text-[#5b5c59] mb-1">
                Bahasa Antarmuka
              </label>
              <select
                id="settings-lang"
                value={settings.language || 'Indonesia'}
                onChange={(e) => updateSettings({ language: e.target.value })}
                className="w-full h-10 rounded-xl bg-[#f2f1ec] px-3 text-sm"
              >
                <option value="Indonesia">Indonesia</option>
                <option value="English">English</option>
              </select>
            </div>
          </article>

          <article className="rounded-2xl border border-slate-200 bg-white/90 p-5 space-y-3 shadow-2xs">
            <h2 className="font-headline font-bold text-base text-[#2e2f2d]">
              Pengujian API & Reset Data
            </h2>
            <p className="text-xs text-[#5b5c59]">
              Gunakan kontrol di bawah ini untuk menguji penanganan Error State API atau mengembalikan data ke kondisi awal.
            </p>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={toggleSimulateApiError}
                className={`h-9 px-4 rounded-full text-xs font-bold cursor-pointer ${
                  simulateErrorMode
                    ? 'bg-[#b41340] text-white'
                    : 'bg-[#f2f1ec] text-[#2e2f2d] hover:bg-[#e4e2de]'
                }`}
              >
                {simulateErrorMode ? 'Matikan Simulasi Error API' : 'Aktifkan Simulasi Error API'}
              </button>

              <button
                type="button"
                onClick={resetAllDataToDefault}
                className="h-9 px-4 rounded-full bg-red-100 hover:bg-red-200 text-red-700 text-xs font-bold cursor-pointer"
              >
                Reset ke Data Awal API
              </button>
            </div>
          </article>
        </div>
      </div>

      {/* Direktori Anggota Tim dari API */}
      <section
        aria-labelledby="team-directory-heading"
        className="rounded-2xl border border-slate-200 bg-white/90 p-5 space-y-4 shadow-2xs"
      >
        <div className="flex items-center justify-between">
          <div>
            <h2 id="team-directory-heading" className="font-headline font-bold text-lg text-[#2e2f2d]">
              Tim Pengembang TugasKu (Data API)
            </h2>
            <p className="text-xs text-[#5b5c59]">
              Pembagian modul halaman dan branch Git kelompok Perancangan dan Pemrograman Web.
            </p>
          </div>
          <button
            type="button"
            onClick={refetch}
            className="text-xs font-bold text-[#a7295a] hover:underline cursor-pointer"
          >
            Refresh
          </button>
        </div>

        {error ? (
          <ErrorState
            title="Gagal Memuat Informasi Tim"
            message={error}
            onRetry={refetch}
          />
        ) : isLoading ? (
          <SkeletonLoader variant="cards" count={2} />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3.5">
            {(systemInfo?.teamMembers || []).map((member) => (
              <article
                key={member.name}
                className="rounded-2xl bg-[#f8f6f2] border border-slate-200/80 p-4 flex flex-col justify-between gap-2"
              >
                <div>
                  <span className="inline-block px-2.5 py-0.5 rounded-full bg-pink-100 text-[#a7295a] text-[10px] font-bold">
                    {member.branch}
                  </span>
                  <h3 className="font-headline font-bold text-sm text-[#2e2f2d] mt-2">
                    {member.name}
                  </h3>
                  <p className="text-xs text-[#5b5c59]">NIM: {member.nim}</p>
                  <p className="text-xs font-medium text-[#2e2f2d] mt-1.5">{member.role}</p>
                </div>
                <p className="text-[11px] text-[#005c57] font-bold pt-2 border-t border-slate-200/70">
                  Halaman: {member.pages}
                </p>
              </article>
            ))}
          </div>
        )}
      </section>
    </section>
  )
}
