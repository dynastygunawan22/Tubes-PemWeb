import React from 'react'
import { TugasKuProvider, useTugasKu } from './context/TugasKuContext'
import { Navbar, NAV_PAGES } from './components/layout/Navbar'
import { SidebarLeft } from './components/layout/SidebarLeft'
import { MobileNav } from './components/layout/MobileNav'
import { Footer } from './components/layout/Footer'
import { Toast } from './components/common/Toast'
import { TaskFormModal } from './components/common/TaskFormModal'
import { formatShortDate, isTaskOverdue } from './utils/dateHelper'

// Dynamic module discovery agar halaman anggota kelompok otomatis terhubung saat file mereka di-push
const pageModules = import.meta.glob('./pages/*.jsx', { eager: true })
const layoutModules = import.meta.glob('./components/layout/*.jsx', { eager: true })
const styleModules = import.meta.glob('./styles/*.css', { eager: true })
void styleModules

const PAGE_COMPONENT_MAP = {
  dashboard: './pages/DashboardPage.jsx',
  'list-tugas': './pages/TaskListPage.jsx',
  'rundown-bulanan': './pages/MonthlyRundownPage.jsx',
  analitik: './pages/AnalyticsPage.jsx',
  'jadwal-harian': './pages/DailySchedulePage.jsx',
  'fokus-timer': './pages/FocusTimerPage.jsx',
  archive: './pages/ArchivePage.jsx',
  settings: './pages/SettingsPage.jsx',
}

function FallbackRightSidebar() {
  const { tasks, selectedDateISO, notesByDate, navigateTo } = useTugasKu()
  const upcoming = tasks
    .filter((t) => t.status !== 'selesai')
    .sort((a, b) => String(a.dueDate).localeCompare(String(b.dueDate)))
    .slice(0, 5)

  return (
    <aside
      aria-label="Ringkasan Deadline Mendatang"
      className="hidden xl:flex w-[320px] shrink-0 sticky top-[65px] h-[calc(100vh-65px)] border-l border-slate-200 bg-[#f2f1ec]/70 backdrop-blur-xs p-5 flex-col gap-5 overflow-y-auto"
    >
      <section className="rounded-2xl bg-white/90 border border-slate-200 p-4 space-y-2 shadow-2xs">
        <div className="flex items-center justify-between">
          <h3 className="font-headline font-bold text-sm text-[#2e2f2d]">Tanggal Aktif</h3>
          <button
            type="button"
            onClick={() => navigateTo('rundown-bulanan')}
            className="text-xs font-bold text-[#a7295a] hover:underline cursor-pointer"
          >
            Buka Rundown
          </button>
        </div>
        <p className="text-xs font-semibold text-[#5b5c59]">{formatShortDate(selectedDateISO)}</p>
        <p className="text-xs text-[#2e2f2d] bg-[#f2f1ec] rounded-xl p-3">
          {notesByDate[selectedDateISO] || 'Belum ada catatan khusus pada tanggal ini.'}
        </p>
      </section>

      <section className="rounded-2xl bg-white/90 border border-slate-200 p-4 space-y-3 shadow-2xs">
        <h3 className="font-headline font-bold text-sm text-[#2e2f2d]">Deadline Mendatang</h3>
        {upcoming.length === 0 ? (
          <p className="text-xs text-[#5b5c59]">Semua tugas telah selesai!</p>
        ) : (
          <div className="space-y-2">
            {upcoming.map((task) => {
              const overdue = isTaskOverdue(task)
              return (
                <article key={task.id} className="rounded-xl bg-[#f2f1ec] p-3">
                  <p className="font-semibold text-xs text-[#2e2f2d] break-words">{task.title}</p>
                  <p
                    className={`text-[11px] mt-1 ${
                      overdue ? 'text-[#b41340] font-bold' : 'text-[#5b5c59]'
                    }`}
                  >
                    {formatShortDate(task.dueDate)} {overdue ? '• Terlambat' : ''}
                  </p>
                </article>
              )
            })}
          </div>
        )}
      </section>
    </aside>
  )
}

function PendingMemberPageNotice({ pageId }) {
  const { navigateTo } = useTugasKu()
  const pageInfo = NAV_PAGES.find((p) => p.id === pageId) || {
    label: pageId,
    owner: 'Anggota Tim',
  }

  return (
    <section className="rounded-3xl border border-slate-200 bg-white/90 p-8 text-center max-w-xl mx-auto my-8 space-y-4 shadow-sm">
      <div className="w-14 h-14 rounded-2xl bg-pink-100 text-[#a7295a] flex items-center justify-center mx-auto">
        <span className="material-symbols-outlined text-3xl">group_work</span>
      </div>
      <h1 className="text-2xl font-headline font-black text-[#2e2f2d]">
        Modul Halaman: {pageInfo.label}
      </h1>
      <p className="text-sm text-[#5b5c59] leading-relaxed">
        Halaman ini merupakan bagian pengerjaan anggota kelompok{' '}
        <strong className="text-[#a7295a]">{pageInfo.owner}</strong>. Begitu file halaman terkait
        di-push ke repository, tampilan ini akan otomatis menampilkan halaman penuh tanpa perlu
        mengubah konfigurasi router utama.
      </p>
      <div className="pt-2">
        <button
          type="button"
          onClick={() => navigateTo('dashboard')}
          className="h-10 px-5 rounded-full bg-[#a7295a] text-white text-xs font-bold cursor-pointer"
        >
          Kembali ke Dashboard
        </button>
      </div>
    </section>
  )
}

function WorkspaceShell() {
  const {
    activePage,
    categories,
    editingTask,
    isTaskModalOpen,
    closeTaskModal,
    addTask,
    updateTask,
    toastMessage,
    clearToast,
  } = useTugasKu()

  const targetModulePath = PAGE_COMPONENT_MAP[activePage] || PAGE_COMPONENT_MAP.dashboard
  const LoadedPageComponent = pageModules[targetModulePath]?.default

  const CustomRightSidebar =
    layoutModules['./components/layout/SidebarRight.jsx']?.SidebarRight ||
    layoutModules['./components/layout/SidebarRight.jsx']?.default

  const showLeftSidebar = ['dashboard', 'list-tugas', 'archive'].includes(activePage)
  const showRightSidebar = ['dashboard', 'rundown-bulanan', 'analitik'].includes(activePage)

  const handleSaveTaskModal = (formData) => {
    if (editingTask) {
      updateTask(editingTask.id, formData)
    } else {
      addTask(formData)
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#f8f6f2] text-[#2e2f2d] relative">
      <div className="fixed inset-0 paper-texture z-0" aria-hidden="true" />

      <Navbar />

      <div className="tugasku-shell-grid flex-1 z-10">
        {showLeftSidebar && <SidebarLeft />}

        <main
          id="main-content"
          tabIndex={-1}
          className="flex-1 min-w-0 p-4 md:p-6 lg:p-8 xl:p-10 focus:outline-none"
        >
          {LoadedPageComponent ? (
            <LoadedPageComponent />
          ) : (
            <PendingMemberPageNotice pageId={activePage} />
          )}
        </main>

        {showRightSidebar &&
          (CustomRightSidebar ? <CustomRightSidebar /> : <FallbackRightSidebar />)}
      </div>

      <Footer />
      <MobileNav />

      <TaskFormModal
        isOpen={isTaskModalOpen}
        editingTask={editingTask}
        categories={categories}
        onClose={closeTaskModal}
        onSave={handleSaveTaskModal}
      />

      <Toast toastMessage={toastMessage} onClose={clearToast} />
    </div>
  )
}

export default function App() {
  return (
    <TugasKuProvider>
      <WorkspaceShell />
    </TugasKuProvider>
  )
}
