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
import type { Reserva } from '@/types/reserva'

interface ReservaDeleteDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  reserva: Reserva | null
  onDelete: (id: string) => Promise<void>
}

export function ReservaDeleteDialog({
  open,
  onOpenChange,
  reserva,
  onDelete,
}: ReservaDeleteDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false)

  async function handleDelete() {
    if (!reserva) return
    setIsDeleting(true)
    try {
      await onDelete(reserva.id)
      toast.success('Reserva excluída com sucesso!')
      onOpenChange(false)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Erro ao excluir reserva')
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
            <AlertDialogTitle>Excluir reserva</AlertDialogTitle>
          </div>
          <AlertDialogDescription className="text-gray-600">
            Tem certeza que deseja excluir a reserva{' '}
            <span className="font-semibold text-gray-900">{reserva?.titulo}</span>? Esta ação não
            pode ser desfeita.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Cancelar</AlertDialogCancel>
          <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
            {isDeleting && <Loader2 className="h-4 w-4 animate-spin" />}
            Excluir reserva
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
