'use client'

import { useState } from 'react'
import { Building2, Plus } from 'lucide-react'
import { useSalas } from '@/hooks/useSalas'
import { Button } from '@/components/ui/button'
import { SalaCard } from '@/components/salas/SalaCard'
import { SalaCardSkeleton } from '@/components/salas/SalaCardSkeleton'
import { SalaDialog } from '@/components/salas/SalaDialog'
import { SalaDeleteDialog } from '@/components/salas/SalaDeleteDialog'
import { EmptyState } from '@/components/shared/EmptyState'
import { ErrorAlert } from '@/components/shared/ErrorAlert'
import { PageHeader } from '@/components/shared/PageHeader'
import type { Sala } from '@/types/sala'

export default function SalasPage() {
  const { salas, loading, error, fetchSalas, createSala, updateSala, deleteSala } = useSalas()

  const [dialogOpen, setDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedSala, setSelectedSala] = useState<Sala | undefined>()
  const [salaToDelete, setSalaToDelete] = useState<Sala | null>(null)

  function handleEdit(sala: Sala) {
    setSelectedSala(sala)
    setDialogOpen(true)
  }

  function handleDelete(sala: Sala) {
    setSalaToDelete(sala)
    setDeleteDialogOpen(true)
  }

  function handleCreate() {
    setSelectedSala(undefined)
    setDialogOpen(true)
  }

  function handleDialogClose(open: boolean) {
    setDialogOpen(open)
    if (!open) setSelectedSala(undefined)
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        icon={Building2}
        title="Salas"
        description={`${salas.length} ${salas.length === 1 ? 'sala cadastrada' : 'salas cadastradas'}`}
        action={
          <Button onClick={handleCreate} className="gap-2">
            <Plus className="h-4 w-4" />
            Nova sala
          </Button>
        }
      />

      {error && <ErrorAlert message={error} onRetry={fetchSalas} />}

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <SalaCardSkeleton key={i} />
          ))}
        </div>
      ) : salas.length === 0 && !error ? (
        <EmptyState
          icon={Building2}
          title="Nenhuma sala cadastrada"
          description="Crie sua primeira sala para começar a gerenciar as reservas."
          action={
            <Button onClick={handleCreate} className="gap-2">
              <Plus className="h-4 w-4" />
              Criar primeira sala
            </Button>
          }
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {salas.map((sala) => (
            <SalaCard
              key={sala.id}
              sala={sala}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      <SalaDialog
        open={dialogOpen}
        onOpenChange={handleDialogClose}
        sala={selectedSala}
        onCreate={createSala}
        onUpdate={updateSala}
      />

      <SalaDeleteDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        sala={salaToDelete}
        onDelete={deleteSala}
      />
    </div>
  )
}
