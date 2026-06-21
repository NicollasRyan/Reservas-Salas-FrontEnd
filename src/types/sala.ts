export interface Sala {
  id: string
  nome: string
  capacidade: number
  createdAt: string
  updatedAt: string
}

export interface CreateSalaData {
  nome: string
  capacidade: number
}

export type UpdateSalaData = CreateSalaData
