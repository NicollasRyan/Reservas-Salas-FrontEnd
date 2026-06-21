'use client'

import { ArrowDownAZ, ArrowUpAZ, SlidersHorizontal } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { Sala } from '@/types/sala'

export type SortOrder = 'asc' | 'desc'

interface ReservaFiltersProps {
  salas: Sala[]
  selectedSalaId: string
  sortOrder: SortOrder
  onSalaChange: (salaId: string) => void
  onSortChange: (order: SortOrder) => void
}

export function ReservaFilters({
  salas,
  selectedSalaId,
  sortOrder,
  onSalaChange,
  onSortChange,
}: ReservaFiltersProps) {
  return (
    <div className="flex flex-col gap-3 rounded-lg border border-gray-200 bg-gray-50 p-3 sm:flex-row sm:items-center">
      <div className="flex items-center gap-2 text-sm font-medium text-gray-500">
        <SlidersHorizontal className="h-4 w-4" />
        <span>Filtros</span>
      </div>

      <div className="flex flex-1 flex-col gap-2 sm:flex-row">
        <Select value={selectedSalaId} onValueChange={onSalaChange}>
          <SelectTrigger className="bg-white sm:max-w-[220px]">
            <SelectValue placeholder="Todas as salas" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas as salas</SelectItem>
            {salas.map((sala) => (
              <SelectItem key={sala.id} value={sala.id}>
                {sala.nome}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button
          variant="outline"
          size="sm"
          onClick={() => onSortChange(sortOrder === 'asc' ? 'desc' : 'asc')}
          className="gap-2 bg-white self-start sm:self-auto"
        >
          {sortOrder === 'asc' ? (
            <ArrowDownAZ className="h-4 w-4" />
          ) : (
            <ArrowUpAZ className="h-4 w-4" />
          )}
          {sortOrder === 'asc' ? 'Mais antigos primeiro' : 'Mais recentes primeiro'}
        </Button>
      </div>
    </div>
  )
}
