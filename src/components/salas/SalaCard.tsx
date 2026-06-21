'use client'

import { Pencil, Trash2, Users, Building2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import type { Sala } from '@/types/sala'

interface SalaCardProps {
  sala: Sala
  onEdit: (sala: Sala) => void
  onDelete: (sala: Sala) => void
}

export function SalaCard({ sala, onEdit, onDelete }: SalaCardProps) {
  return (
    <Card className="flex flex-col transition-shadow hover:shadow-md">
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50">
              <Building2 className="h-5 w-5 text-blue-600" />
            </div>
            <CardTitle className="text-base leading-tight">{sala.nome}</CardTitle>
          </div>
          <div className="flex shrink-0 items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onEdit(sala)}
              className="h-8 w-8 text-gray-400 hover:text-blue-600"
              aria-label={`Editar ${sala.nome}`}
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDelete(sala)}
              className="h-8 w-8 text-gray-400 hover:text-red-600"
              aria-label={`Excluir ${sala.nome}`}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="mt-auto">
        <Badge variant="secondary" className="gap-1.5">
          <Users className="h-3.5 w-3.5" />
          {sala.capacidade} {sala.capacidade === 1 ? 'pessoa' : 'pessoas'}
        </Badge>
      </CardContent>
    </Card>
  )
}
