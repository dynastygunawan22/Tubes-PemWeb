import { useState, useEffect, useCallback } from 'react'

export function useFetchData(fetcherFn, dependencies = []) {
  const [data, setData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  const executeFetch = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const result = await fetcherFn()
      setData(result)
    } catch (err) {
      setError(err?.message || 'Gagal memuat data dari server.')
    } finally {
      setIsLoading(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies)

  useEffect(() => {
    executeFetch()
  }, [executeFetch])

  return {
    data,
    setData,
    isLoading,
    error,
    refetch: executeFetch,
  }
}
