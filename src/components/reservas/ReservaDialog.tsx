'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { ReservaForm } from './ReservaForm'
import type { Reserva, CreateReservaData, UpdateReservaData } from '@/types/reserva'
import type { Sala } from '@/types/sala'
import type { ReservaFormData } from '@/lib/validations'

interface ReservaDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  reserva?: Reserva
  salas: Sala[]
  onCreate?: (data: CreateReservaData) => Promise<unknown>
  onUpdate?: (id: string, data: UpdateReservaData) => Promise<unknown>
}

export function ReservaDialog({
  open,
  onOpenChange,
  reserva,
  salas,
  onCreate,
  onUpdate,
}: ReservaDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const isEditing = !!reserva

  async function handleSubmit(formData: ReservaFormData) {
    setIsSubmitting(true)
    try {
      const payload: CreateReservaData = {
        titulo: formData.titulo,
        participantes: formData.participantes,
        salaId: formData.salaId,
        inicio: new Date(formData.inicio).toISOString(),
        fim: new Date(formData.fim).toISOString(),
      }

      if (isEditing && onUpdate) {
        await onUpdate(reserva.id, payload)
        toast.success('Reserva atualizada com sucesso!')
      } else if (onCreate) {
        await onCreate(payload)
        toast.success('Reserva criada com sucesso!')
      }
      onOpenChange(false)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Erro ao salvar reserva')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-140">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Editar Reserva' : 'Nova Reserva'}</DialogTitle>
          <DialogDescription>
            {isEditing
              ? 'Altere os dados da reserva abaixo.'
              : 'Preencha os dados para criar uma nova reserva.'}
          </DialogDescription>
        </DialogHeader>
        <ReservaForm
          defaultValues={reserva}
          salas={salas}
          onSubmit={handleSubmit}
          onCancel={() => onOpenChange(false)}
          isSubmitting={isSubmitting}
        />
      </DialogContent>
    </Dialog>
  )
}
