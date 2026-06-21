'use client'

import { useState, useCallback, useEffect } from 'react'
import type { Sala, CreateSalaData, UpdateSalaData } from '@/types/sala'
import { salasService } from '@/services/salas.service'

interface UseSalasState {
  salas: Sala[]
  loading: boolean
  error: string | null
}

export function useSalas() {
  const [state, setState] = useState<UseSalasState>({
    salas: [],
    loading: true,
    error: null,
  })

  const fetchSalas = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }))
    try {
      const result = await salasService.list()
      const salas = Array.isArray(result) ? result : []
      setState({ salas, loading: false, error: null })
    } catch (err) {
      setState((prev) => ({
        ...prev,
        loading: false,
        error: err instanceof Error ? err.message : 'Erro ao carregar salas',
      }))
    }
  }, [])

  useEffect(() => {
    fetchSalas()
  }, [fetchSalas])

  const createSala = useCallback(
    async (data: CreateSalaData): Promise<Sala> => {
      const sala = await salasService.create(data)
      setState((prev) => ({ ...prev, salas: [...prev.salas, sala] }))
      return sala
    },
    []
  )

  const updateSala = useCallback(
    async (id: string, data: UpdateSalaData): Promise<Sala> => {
      const updated = await salasService.update(id, data)
      setState((prev) => ({
        ...prev,
        salas: prev.salas.map((s) => (s.id === id ? updated : s)),
      }))
      return updated
    },
    []
  )

  const deleteSala = useCallback(async (id: string): Promise<void> => {
    await salasService.delete(id)
    setState((prev) => ({
      ...prev,
      salas: prev.salas.filter((s) => s.id !== id),
    }))
  }, [])

  return {
    salas: state.salas,
    loading: state.loading,
    error: state.error,
    fetchSalas,
    createSala,
    updateSala,
    deleteSala,
  }
}
