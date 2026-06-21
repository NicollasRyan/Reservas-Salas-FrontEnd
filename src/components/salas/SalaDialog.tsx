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
import { SalaForm } from './SalaForm'
import type { Sala, CreateSalaData, UpdateSalaData } from '@/types/sala'
import type { SalaFormData } from '@/lib/validations'

interface SalaDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  sala?: Sala
  onCreate?: (data: CreateSalaData) => Promise<unknown>
  onUpdate?: (id: string, data: UpdateSalaData) => Promise<unknown>
}

export function SalaDialog({ open, onOpenChange, sala, onCreate, onUpdate }: SalaDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const isEditing = !!sala

  async function handleSubmit(data: SalaFormData) {
    setIsSubmitting(true)
    try {
      if (isEditing && onUpdate) {
        await onUpdate(sala.id, data)
        toast.success('Sala atualizada com sucesso!')
      } else if (onCreate) {
        await onCreate(data)
        toast.success('Sala criada com sucesso!')
      }
      onOpenChange(false)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Erro ao salvar sala')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Editar Sala' : 'Nova Sala'}</DialogTitle>
          <DialogDescription>
            {isEditing
              ? 'Altere os dados da sala abaixo.'
              : 'Preencha os dados para cadastrar uma nova sala.'}
          </DialogDescription>
        </DialogHeader>
        <SalaForm
          defaultValues={sala}
          onSubmit={handleSubmit}
          onCancel={() => onOpenChange(false)}
          isSubmitting={isSubmitting}
        />
      </DialogContent>
    </Dialog>
  )
}
