'use client'

import { Pencil, Trash2, Users, Clock, Building2 } from 'lucide-react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ReservaStatusBadge } from './ReservaStatusBadge'
import { formatDateTimeRange } from '@/utils/date'
import type { Reserva } from '@/types/reserva'

interface ReservaCardProps {
  reserva: Reserva
  onEdit: (reserva: Reserva) => void
  onDelete: (reserva: Reserva) => void
}

export function ReservaCard({ reserva, onEdit, onDelete }: ReservaCardProps) {
  return (
    <Card className="flex flex-col transition-shadow hover:shadow-md">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 leading-tight truncate">{reserva.titulo}</h3>
          </div>
          <div className="flex shrink-0 items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onEdit(reserva)}
              className="h-8 w-8 text-gray-400 hover:text-blue-600"
              aria-label={`Editar ${reserva.titulo}`}
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDelete(reserva)}
              className="h-8 w-8 text-gray-400 hover:text-red-600"
              aria-label={`Excluir ${reserva.titulo}`}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <ReservaStatusBadge inicio={reserva.inicio} fim={reserva.fim} className="self-start mt-1" />
      </CardHeader>

      <CardContent className="flex flex-col gap-2 text-sm text-gray-600">
        {reserva.sala && (
          <div className="flex items-center gap-2">
            <Building2 className="h-4 w-4 shrink-0 text-gray-400" />
            <span className="font-medium text-gray-700">{reserva.sala.nome}</span>
          </div>
        )}

        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 shrink-0 text-gray-400" />
          <span>{formatDateTimeRange(reserva.inicio, reserva.fim)}</span>
        </div>

        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 shrink-0 text-gray-400" />
          <span>
            {reserva.participantes} {reserva.participantes === 1 ? 'participante' : 'participantes'}
          </span>
        </div>
      </CardContent>
    </Card>
  )
}
