'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { Loader2, TriangleAlert } from 'lucide-react'
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogCancel,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import type { Sala } from '@/types/sala'

interface SalaDeleteDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  sala: Sala | null
  onDelete: (id: string) => Promise<void>
}

export function SalaDeleteDialog({ open, onOpenChange, sala, onDelete }: SalaDeleteDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false)

  async function handleDelete() {
    if (!sala) return
    setIsDeleting(true)
    try {
      await onDelete(sala.id)
      toast.success('Sala excluída com sucesso!')
      onOpenChange(false)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Erro ao excluir sala')
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100 shrink-0">
              <TriangleAlert className="h-5 w-5 text-red-600" />
            </div>
            <AlertDialogTitle>Excluir sala</AlertDialogTitle>
          </div>
          <AlertDialogDescription className="text-gray-600">
            Tem certeza que deseja excluir{' '}
            <span className="font-semibold text-gray-900">{sala?.nome}</span>? Esta ação não pode
            ser desfeita e todas as reservas associadas serão excluídas.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Cancelar</AlertDialogCancel>
          <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
            {isDeleting && <Loader2 className="h-4 w-4 animate-spin" />}
            Excluir sala
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
