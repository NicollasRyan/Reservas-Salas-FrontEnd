import api from './api'
import type { Sala, CreateSalaData, UpdateSalaData } from '@/types/sala.js'

export const salasService = {
  async list(): Promise<Sala[]> {
    const { data } = await api.get<Sala[]>('/salas')
    return data
  },

  async getById(id: string): Promise<Sala> {
    const { data } = await api.get<Sala>(`/salas/${id}`)
    return data
  },

  async create(payload: CreateSalaData): Promise<Sala> {
    const { data } = await api.post<Sala>('/salas', payload)
    return data
  },

  async update(id: string, payload: UpdateSalaData): Promise<Sala> {
    const { data } = await api.put<Sala>(`/salas/${id}`, payload)
    return data
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/salas/${id}`)
  },
}
