import api from './api'
import type {
  Reserva,
  CreateReservaData,
  UpdateReservaData,
  PaginatedReservas,
  ListReservasParams,
} from '@/types/reserva'

export const reservasService = {
  async list(params?: ListReservasParams): Promise<PaginatedReservas> {
    const { data } = await api.get<PaginatedReservas>('/reservas', { params })
    return data
  },

  async getById(id: string): Promise<Reserva> {
    const { data } = await api.get<Reserva>(`/reservas/${id}`)
    return data
  },

  async create(payload: CreateReservaData): Promise<Reserva> {
    const { data } = await api.post<Reserva>('/reservas', payload)
    return data
  },

  async update(id: string, payload: UpdateReservaData): Promise<Reserva> {
    const { data } = await api.put<Reserva>(`/reservas/${id}`, payload)
    return data
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/reservas/${id}`)
  },
}
