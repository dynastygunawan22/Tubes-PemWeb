import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react'
import { fetchInitialTasks, fetchDailyProductivityQuote } from '../services/taskService'
import { getSimulatedApiError, setSimulatedApiError } from '../services/apiClient'
import {
  getTodayISO,
  fitDateToMonth,
  isTaskOverdue,
  addDaysToISO,
} from '../utils/dateHelper'

const STORAGE_KEY = 'tugasku.react.state.v1'

export const STATUS_MAP = {
  belum: {
    label: 'Belum Selesai',
    chipClass: 'bg-red-100 text-red-700 border border-red-200',
    dotClass: 'bg-red-500',
  },
  progress: {
    label: 'On Progress',
    chipClass: 'bg-amber-100 text-amber-800 border border-amber-200',
    dotClass: 'bg-amber-500',
  },
  selesai: {
    label: 'Selesai',
    chipClass: 'bg-emerald-100 text-emerald-700 border border-emerald-200',
    dotClass: 'bg-emerald-500',
  },
}

const DEFAULT_CATEGORIES = ['Akademik', 'Non Akademik', 'Personal', 'Organisasi']

const DEFAULT_SCHEDULES = {
  weekday: [
    { id: 201, time: '07.00 - 08.30', activity: 'Review materi kuliah & latihan koding pagi', location: 'Kamar Kost', type: 'Belajar Mandiri' },
    { id: 202, time: '09.00 - 11.30', activity: 'Kuliah Perancangan & Pemrograman Web', location: 'Gedung Kuliah GKU R.302', type: 'Kuliah' },
    { id: 203, time: '13.00 - 15.00', activity: 'Praktikum Laboratorium & diskusi kelompok', location: 'Lab Komputer 2', type: 'Kuliah' },
    { id: 204, time: '19.30 - 21.00', activity: 'Mengerjakan cicilan Tugas Besar & laporan', location: 'Perpustakaan / Kost', type: 'Belajar Mandiri' },
  ],
  weekend: [
    { id: 205, time: '08.00 - 09.30', activity: 'Evaluasi mingguan & menyusun rundown pekan depan', location: 'Meja Belajar', type: 'Perencanaan' },
    { id: 206, time: '10.00 - 12.00', activity: 'Rapat koordinasi organisasi & kepanitiaan kampus', location: 'Student Center', type: 'Organisasi' },
    { id: 207, time: '16.00 - 17.30', activity: 'Olahraga sore & istirahat pemulihan fokus', location: 'Lapangan Kampus', type: 'Personal' },
  ],
}

const DEFAULT_SETTINGS = {
  studentName: 'Dynasty Danna Gunawan',
  studentNim: '103082400037',
  studentClass: 'SE-07-02',
  dailyTargetTasks: 5,
  reminderHMinus1: true,
  reminderUrgent: true,
  language: 'Indonesia',
  compactMode: false,
}

const TugasKuContext = createContext(null)

export function TugasKuProvider({ children }) {
  const today = new Date()
  const todayISO = getTodayISO()

  const [activePage, setActivePage] = useState(() => {
    const params = new URLSearchParams(window.location.search)
    return params.get('page') || params.get('tab') || 'dashboard'
  })
  const [activeFilter, setActiveFilter] = useState('all')
  const [activeMonth, setActiveMonth] = useState(today.getMonth())
  const [selectedDateISO, setSelectedDateISO] = useState(todayISO)
  const [activeScheduleTab, setActiveScheduleTab] = useState('weekday')
  const [searchQuery, setSearchQuery] = useState('')
  const [taskStatusFilter, setTaskStatusFilter] = useState('all')
  const [taskCategoryFilter, setTaskCategoryFilter] = useState('all')

  const [tasks, setTasks] = useState([])
  const [categories, setCategories] = useState(DEFAULT_CATEGORIES)
  const [schedules, setSchedules] = useState(DEFAULT_SCHEDULES)
  const [notesByDate, setNotesByDate] = useState({})
  const [settings, setSettings] = useState(DEFAULT_SETTINGS)

  const [isLoadingTasks, setIsLoadingTasks] = useState(true)
  const [apiError, setApiError] = useState(null)
  const [simulateErrorMode, setSimulateErrorMode] = useState(() => getSimulatedApiError())

  const [dailyQuote, setDailyQuote] = useState(null)
  const [isQuoteLoading, setIsQuoteLoading] = useState(true)
  const [quoteError, setQuoteError] = useState(null)

  const [toastMessage, setToastMessage] = useState(null)
  const [editingTask, setEditingTask] = useState(null)
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false)

  const showToast = useCallback((message, type = 'info') => {
    setToastMessage({ id: Date.now(), text: message, type })
  }, [])

  const clearToast = useCallback(() => {
    setToastMessage(null)
  }, [])

  // Sinkronisasi URL query parameter saat berpindah halaman agar link bisa di-bookmark
  const navigateTo = useCallback((pageKey) => {
    setActivePage(pageKey)
    const url = new URL(window.location.href)
    url.searchParams.set('page', pageKey)
    window.history.pushState({}, '', url.toString())
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  useEffect(() => {
    const onPopState = () => {
      const params = new URLSearchParams(window.location.search)
      const page = params.get('page') || params.get('tab') || 'dashboard'
      setActivePage(page)
    }
    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
  }, [])

  const loadQuoteFromApi = useCallback(async () => {
    setIsQuoteLoading(true)
    setQuoteError(null)
    try {
      const q = await fetchDailyProductivityQuote()
      setDailyQuote(q)
    } catch (err) {
      setQuoteError(err.message || 'Gagal memuat kutipan produktivitas.')
    } finally {
      setIsQuoteLoading(false)
    }
  }, [])

  const loadInitialWorkspaceData = useCallback(async (forceResetFromApi = false) => {
    setIsLoadingTasks(true)
    setApiError(null)

    try {
      const fetchedTasks = await fetchInitialTasks()
      const rawSaved = !forceResetFromApi ? localStorage.getItem(STORAGE_KEY) : null

      if (rawSaved) {
        const parsed = JSON.parse(rawSaved)
        setTasks(Array.isArray(parsed.tasks) && parsed.tasks.length > 0 ? parsed.tasks : fetchedTasks)
        setCategories(Array.isArray(parsed.categories) && parsed.categories.length > 0 ? parsed.categories : DEFAULT_CATEGORIES)
        setSchedules(parsed.schedules || DEFAULT_SCHEDULES)
        setNotesByDate(parsed.notesByDate || {
          [todayISO]: 'Fokus menyelesaikan modul halaman utama dan menguji responsivitas tabel.',
          [addDaysToISO(todayISO, 1)]: 'Jadwal asistensi kelompok Pemrograman Web pukul 13.00.',
        })
        setSettings({ ...DEFAULT_SETTINGS, ...(parsed.settings || {}) })
      } else {
        setTasks(fetchedTasks)
        setCategories(DEFAULT_CATEGORIES)
        setSchedules(DEFAULT_SCHEDULES)
        setNotesByDate({
          [todayISO]: 'Fokus menyelesaikan modul halaman utama dan menguji responsivitas tabel.',
          [addDaysToISO(todayISO, 1)]: 'Jadwal asistensi kelompok Pemrograman Web pukul 13.00.',
        })
        setSettings(DEFAULT_SETTINGS)
      }
    } catch (err) {
      setApiError(err.message || 'Terjadi kesalahan saat mengambil data tugas dari API.')
    } finally {
      setIsLoadingTasks(false)
    }
  }, [todayISO])

  useEffect(() => {
    loadInitialWorkspaceData(false)
    loadQuoteFromApi()
  }, [loadInitialWorkspaceData, loadQuoteFromApi])

  // Simpan perubahan ke localStorage setelah pemuatan pertama selesai
  useEffect(() => {
    if (isLoadingTasks || apiError) return
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          tasks,
          categories,
          schedules,
          notesByDate,
          settings,
        })
      )
    } catch {
      // Abaikan jika kuota penyimpanan penuh
    }
  }, [tasks, categories, schedules, notesByDate, settings, isLoadingTasks, apiError])

  const toggleSimulateApiError = useCallback(() => {
    const nextVal = !simulateErrorMode
    setSimulatedApiError(nextVal)
    setSimulateErrorMode(nextVal)
    loadInitialWorkspaceData(false)
    loadQuoteFromApi()
    showToast(
      nextVal
        ? 'Mode simulasi error API diaktifkan. Klik Coba Lagi untuk memulihkan.'
        : 'Mode simulasi error dimatikan. Data berhasil dimuat ulang.',
      nextVal ? 'error' : 'success'
    )
  }, [simulateErrorMode, loadInitialWorkspaceData, loadQuoteFromApi, showToast])

  const retryApiFetch = useCallback(() => {
    if (simulateErrorMode) {
      setSimulatedApiError(false)
      setSimulateErrorMode(false)
    }
    loadInitialWorkspaceData(false)
    loadQuoteFromApi()
    showToast('Memuat ulang data dari server API...', 'info')
  }, [simulateErrorMode, loadInitialWorkspaceData, loadQuoteFromApi, showToast])

  // CRUD Tugas
  const addTask = useCallback(
    (taskPayload) => {
      const newTask = {
        id: Date.now() + Math.floor(Math.random() * 10000),
        title: String(taskPayload.title).trim(),
        description: String(taskPayload.description || '').trim(),
        category: taskPayload.category || categories[0] || 'Personal',
        startDate: taskPayload.startDate || todayISO,
        dueDate: taskPayload.dueDate || todayISO,
        status: taskPayload.status || 'belum',
        urgent: Boolean(taskPayload.urgent),
        estimatedMinutes: Number(taskPayload.estimatedMinutes || 30),
      }
      setTasks((prev) => [newTask, ...prev])
      showToast('Tugas baru berhasil ditambahkan ke daftar.', 'success')
      return newTask
    },
    [categories, todayISO, showToast]
  )

  const updateTask = useCallback(
    (taskId, updatedFields) => {
      setTasks((prev) =>
        prev.map((item) => (item.id === Number(taskId) ? { ...item, ...updatedFields } : item))
      )
      showToast('Perubahan tugas berhasil disimpan.', 'success')
    },
    [showToast]
  )

  const toggleTaskDone = useCallback(
    (taskId) => {
      setTasks((prev) =>
        prev.map((item) => {
          if (item.id !== Number(taskId)) return item
          const nextStatus = item.status === 'selesai' ? 'progress' : 'selesai'
          return { ...item, status: nextStatus }
        })
      )
    },
    []
  )

  const toggleTaskUrgent = useCallback((taskId) => {
    setTasks((prev) =>
      prev.map((item) => (item.id === Number(taskId) ? { ...item, urgent: !item.urgent } : item))
    )
  }, [])

  const deleteTask = useCallback(
    (taskId) => {
      setTasks((prev) => prev.filter((item) => item.id !== Number(taskId)))
      showToast('Tugas telah dihapus.', 'info')
    },
    [showToast]
  )

  const markAllTasksDone = useCallback(() => {
    setTasks((prev) => prev.map((item) => ({ ...item, status: 'selesai' })))
    showToast('Semua tugas berhasil ditandai selesai!', 'success')
  }, [showToast])

  const restoreArchivedTask = useCallback(
    (taskId) => {
      setTasks((prev) =>
        prev.map((item) => (item.id === Number(taskId) ? { ...item, status: 'progress' } : item))
      )
      showToast('Tugas dikembalikan ke daftar aktif (On Progress).', 'success')
    },
    [showToast]
  )

  const clearCompletedTasks = useCallback(() => {
    setTasks((prev) => prev.filter((item) => item.status !== 'selesai'))
    showToast('Seluruh arsip tugas selesai telah dibersihkan.', 'info')
  }, [showToast])

  // CRUD Kategori
  const addCategory = useCallback(
    (categoryName) => {
      const clean = String(categoryName).trim()
      if (!clean) return false
      setCategories((prev) => [...prev, clean])
      showToast(`Kategori "${clean}" berhasil ditambahkan.`, 'success')
      return true
    },
    [showToast]
  )

  const removeCategory = useCallback(
    (categoryName) => {
      if (['Akademik', 'Non Akademik', 'Personal'].includes(categoryName)) {
        showToast('Kategori bawaan utama tidak dapat dihapus.', 'error')
        return false
      }
      setCategories((prev) => prev.filter((c) => c !== categoryName))
      setTasks((prev) =>
        prev.map((t) => (t.category === categoryName ? { ...t, category: 'Personal' } : t))
      )
      showToast(`Kategori "${categoryName}" dihapus.`, 'info')
      return true
    },
    [showToast]
  )

  // CRUD Catatan Kalender / Rundown
  const saveDateNote = useCallback(
    (isoDate, rawNoteText) => {
      const text = String(rawNoteText || '').trim()
      if (!text) {
        showToast('Catatan kosong tidak dapat disimpan.', 'error')
        return false
      }
      setNotesByDate((prev) => ({
        ...prev,
        [isoDate]: text,
      }))
      showToast('Catatan tanggal berhasil disimpan.', 'success')
      return true
    },
    [showToast]
  )

  const deleteDateNote = useCallback(
    (isoDate) => {
      setNotesByDate((prev) => {
        const next = { ...prev }
        delete next[isoDate]
        return next
      })
      showToast('Catatan tanggal telah dihapus.', 'info')
    },
    [showToast]
  )

  // CRUD Jadwal Harian
  const addScheduleItem = useCallback(
    (tabType, itemPayload) => {
      const targetTab = tabType || activeScheduleTab
      const newItem = {
        id: Date.now() + Math.floor(Math.random() * 10000),
        time: String(itemPayload.time).trim(),
        activity: String(itemPayload.activity).trim(),
        location: String(itemPayload.location || 'Kampus / Kost').trim(),
        type: itemPayload.type || 'Belajar Mandiri',
      }
      setSchedules((prev) => ({
        ...prev,
        [targetTab]: [...(prev[targetTab] || []), newItem],
      }))
      showToast('Slot jadwal harian berhasil ditambahkan.', 'success')
    },
    [activeScheduleTab, showToast]
  )

  const removeScheduleItem = useCallback(
    (tabType, itemId) => {
      const targetTab = tabType || activeScheduleTab
      setSchedules((prev) => ({
        ...prev,
        [targetTab]: (prev[targetTab] || []).filter((x) => x.id !== Number(itemId)),
      }))
      showToast('Item jadwal berhasil dihapus.', 'info')
    },
    [activeScheduleTab, showToast]
  )

  const changeActiveMonth = useCallback(
    (nextMonthIndex) => {
      const normalized = (nextMonthIndex + 12) % 12
      setActiveMonth(normalized)
      setSelectedDateISO((prevISO) => fitDateToMonth(prevISO, normalized))
    },
    []
  )

  const updateSettings = useCallback(
    (newPartialSettings) => {
      setSettings((prev) => ({ ...prev, ...newPartialSettings }))
      showToast('Preferensi pengaturan berhasil diperbarui.', 'success')
    },
    [showToast]
  )

  const resetAllDataToDefault = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY)
    loadInitialWorkspaceData(true)
    showToast('Data aplikasi dikembalikan ke setelan awal Mock API.', 'info')
  }, [loadInitialWorkspaceData, showToast])

  // Kalkulasi metrik & daftar terfilter
  const metrics = useMemo(() => {
    const total = tasks.length
    const completed = tasks.filter((t) => t.status === 'selesai').length
    const inProgress = tasks.filter((t) => t.status === 'progress').length
    const pending = tasks.filter((t) => t.status === 'belum').length
    const overdue = tasks.filter((t) => isTaskOverdue(t)).length
    const urgentCount = tasks.filter((t) => t.urgent && t.status !== 'selesai').length
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0
    const totalMinutes = tasks.reduce((acc, t) => acc + Number(t.estimatedMinutes || 30), 0)
    const consistencyLabel =
      completionRate >= 75 ? 'Solid' : completionRate >= 45 ? 'Stabil' : 'Mulai'

    return {
      total,
      completed,
      inProgress,
      pending,
      overdue,
      urgentCount,
      completionRate,
      totalMinutes,
      consistencyLabel,
    }
  }, [tasks])

  const sidebarFilteredTasks = useMemo(() => {
    return tasks.filter((t) => {
      if (activeFilter === 'all') return true
      if (activeFilter === 'today') return t.dueDate === todayISO
      if (activeFilter === 'urgent') return Boolean(t.urgent)
      if (activeFilter === 'progress') return t.status === 'progress'
      if (activeFilter === 'overdue') return isTaskOverdue(t)
      if (activeFilter === 'selesai') return t.status === 'selesai'
      return true
    })
  }, [tasks, activeFilter, todayISO])

  const tableFilteredTasks = useMemo(() => {
    const q = searchQuery.trim().toLowerCase()
    return sidebarFilteredTasks.filter((t) => {
      const matchQuery =
        !q ||
        `${t.title} ${t.description || ''} ${t.category}`.toLowerCase().includes(q)
      const matchStatus = taskStatusFilter === 'all' || t.status === taskStatusFilter
      const matchCategory = taskCategoryFilter === 'all' || t.category === taskCategoryFilter
      return matchQuery && matchStatus && matchCategory
    })
  }, [sidebarFilteredTasks, searchQuery, taskStatusFilter, taskCategoryFilter])

  const openCreateTaskModal = useCallback(() => {
    setEditingTask(null)
    setIsTaskModalOpen(true)
  }, [])

  const openEditTaskModal = useCallback((taskObj) => {
    setEditingTask(taskObj)
    setIsTaskModalOpen(true)
  }, [])

  const closeTaskModal = useCallback(() => {
    setEditingTask(null)
    setIsTaskModalOpen(false)
  }, [])

  const value = {
    todayISO,
    activePage,
    navigateTo,
    activeFilter,
    setActiveFilter,
    activeMonth,
    changeActiveMonth,
    selectedDateISO,
    setSelectedDateISO,
    activeScheduleTab,
    setActiveScheduleTab,
    searchQuery,
    setSearchQuery,
    taskStatusFilter,
    setTaskStatusFilter,
    taskCategoryFilter,
    setTaskCategoryFilter,
    tasks,
    categories,
    schedules,
    notesByDate,
    settings,
    metrics,
    sidebarFilteredTasks,
    tableFilteredTasks,
    isLoadingTasks,
    apiError,
    simulateErrorMode,
    toggleSimulateApiError,
    retryApiFetch,
    dailyQuote,
    isQuoteLoading,
    quoteError,
    loadQuoteFromApi,
    addTask,
    updateTask,
    toggleTaskDone,
    toggleTaskUrgent,
    deleteTask,
    markAllTasksDone,
    restoreArchivedTask,
    clearCompletedTasks,
    addCategory,
    removeCategory,
    saveDateNote,
    deleteDateNote,
    addScheduleItem,
    removeScheduleItem,
    updateSettings,
    resetAllDataToDefault,
    toastMessage,
    showToast,
    clearToast,
    editingTask,
    isTaskModalOpen,
    openCreateTaskModal,
    openEditTaskModal,
    closeTaskModal,
  }

  return <TugasKuContext.Provider value={value}>{children}</TugasKuContext.Provider>
}

export function useTugasKu() {
  const ctx = useContext(TugasKuContext)
  if (!ctx) {
    throw new Error('useTugasKu harus dipanggil di dalam komponen TugasKuProvider.')
  }
  return ctx
}
