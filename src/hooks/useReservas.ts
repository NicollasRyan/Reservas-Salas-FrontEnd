'use client'

import { useState, useCallback, useEffect } from 'react'
import type { Reserva, CreateReservaData, UpdateReservaData, ListReservasParams } from '@/types/reserva'
import { reservasService } from '@/services/reservas.service'

interface UseReservasState {
  reservas: Reserva[]
  total: number
  totalPages: number
  loading: boolean
  error: string | null
}

export function useReservas(params: ListReservasParams = {}) {
  const { salaId, page = 1, pageSize = 20, orderBy = 'asc' } = params

  const [state, setState] = useState<UseReservasState>({
    reservas: [],
    total: 0,
    totalPages: 1,
    loading: true,
    error: null,
  })

  const fetchReservas = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }))
    try {
      const result = await reservasService.list({ salaId, page, pageSize, orderBy })
      // Suporta tanto a resposta paginada { data, total, ... } quanto array direto (retrocompatibilidade)
      const data = Array.isArray(result) ? result : (Array.isArray(result.data) ? result.data : [])
      const total = Array.isArray(result) ? result.length : (result.total ?? data.length)
      const totalPages = Array.isArray(result) ? 1 : (result.totalPages ?? 1)
      setState({
        reservas: data,
        total,
        totalPages,
        loading: false,
        error: null,
      })
    } catch (err) {
      setState((prev) => ({
        ...prev,
        loading: false,
        error: err instanceof Error ? err.message : 'Erro ao carregar reservas',
      }))
    }
  }, [salaId, page, pageSize, orderBy])

  useEffect(() => {
    fetchReservas()
  }, [fetchReservas])

  const createReserva = useCallback(
    async (data: CreateReservaData): Promise<Reserva> => {
      const reserva = await reservasService.create(data)
      await fetchReservas()
      return reserva
    },
    [fetchReservas],
  )

  const updateReserva = useCallback(
    async (id: string, data: UpdateReservaData): Promise<Reserva> => {
      const updated = await reservasService.update(id, data)
      setState((prev) => ({
        ...prev,
        reservas: prev.reservas.map((r) => (r.id === id ? updated : r)),
      }))
      return updated
    },
    [],
  )

  const deleteReserva = useCallback(
    async (id: string): Promise<void> => {
      await reservasService.delete(id)
      await fetchReservas()
    },
    [fetchReservas],
  )

  return {
    reservas: state.reservas,
    total: state.total,
    totalPages: state.totalPages,
    loading: state.loading,
    error: state.error,
    fetchReservas,
    createReserva,
    updateReserva,
    deleteReserva,
  }
}
