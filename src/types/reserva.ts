import type { Sala } from './sala.js'

export type ReservaStatus = 'em-andamento' | 'proxima' | 'encerrada'

export interface Reserva {
  id: string
  titulo: string
  participantes: number
  inicio: string
  fim: string
  salaId: string
  sala?: Sala
  createdAt: string
  updatedAt: string
}

export interface CreateReservaData {
  titulo: string
  participantes: number
  inicio: string
  fim: string
  salaId: string
}

export type UpdateReservaData = CreateReservaData

export interface PaginatedReservas {
  data: Reserva[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

export interface ListReservasParams {
  salaId?: string
  page?: number
  pageSize?: number
  orderBy?: 'asc' | 'desc'
}
