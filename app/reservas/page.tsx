'use client'

import { useState, useMemo } from 'react'
import { CalendarRange, Plus } from 'lucide-react'
import { useSalas } from '@/hooks/useSalas'
import { useReservas } from '@/hooks/useReservas'
import { Button } from '@/components/ui/button'
import { ReservaCard } from '@/components/reservas/ReservaCard'
import { ReservaCardSkeleton } from '@/components/reservas/ReservaCardSkeleton'
import { ReservaDialog } from '@/components/reservas/ReservaDialog'
import { ReservaDeleteDialog } from '@/components/reservas/ReservaDeleteDialog'
import { ReservaFilters, type SortOrder } from '@/components/reservas/ReservaFilters'
import { EmptyState } from '@/components/shared/EmptyState'
import { ErrorAlert } from '@/components/shared/ErrorAlert'
import { PageHeader } from '@/components/shared/PageHeader'
import type { Reserva } from '@/types/reserva'

export default function ReservasPage() {
  const { salas } = useSalas()
  const { reservas, loading, error, fetchReservas, createReserva, updateReserva, deleteReserva } =
    useReservas()

  const [dialogOpen, setDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedReserva, setSelectedReserva] = useState<Reserva | undefined>()
  const [reservaToDelete, setReservaToDelete] = useState<Reserva | null>(null)

  const [selectedSalaId, setSelectedSalaId] = useState<string>('all')
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc')

  const filteredAndSorted = useMemo(() => {
    let result = [...reservas]

    if (selectedSalaId !== 'all') {
      result = result.filter((r) => r.salaId === selectedSalaId)
    }

    result.sort((a, b) => {
      const diff = new Date(a.inicio).getTime() - new Date(b.inicio).getTime()
      return sortOrder === 'asc' ? diff : -diff
    })

    return result
  }, [reservas, selectedSalaId, sortOrder])

  function handleEdit(reserva: Reserva) {
    setSelectedReserva(reserva)
    setDialogOpen(true)
  }

  function handleDelete(reserva: Reserva) {
    setReservaToDelete(reserva)
    setDeleteDialogOpen(true)
  }

  function handleCreate() {
    setSelectedReserva(undefined)
    setDialogOpen(true)
  }

  function handleDialogClose(open: boolean) {
    setDialogOpen(open)
    if (!open) setSelectedReserva(undefined)
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        icon={CalendarRange}
        title="Reservas"
        description={`${reservas.length} ${reservas.length === 1 ? 'reserva cadastrada' : 'reservas cadastradas'}`}
        action={
          <Button onClick={handleCreate} className="gap-2" disabled={salas.length === 0}>
            <Plus className="h-4 w-4" />
            Nova reserva
          </Button>
        }
      />

      {salas.length === 0 && !loading && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          Cadastre pelo menos uma sala antes de criar reservas.
        </div>
      )}

      {error && <ErrorAlert message={error} onRetry={fetchReservas} />}

      {!loading && reservas.length > 0 && (
        <ReservaFilters
          salas={salas}
          selectedSalaId={selectedSalaId}
          sortOrder={sortOrder}
          onSalaChange={setSelectedSalaId}
          onSortChange={setSortOrder}
        />
      )}

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <ReservaCardSkeleton key={i} />
          ))}
        </div>
      ) : filteredAndSorted.length === 0 && !error ? (
        reservas.length === 0 ? (
          <EmptyState
            icon={CalendarRange}
            title="Nenhuma reserva cadastrada"
            description="Crie sua primeira reserva selecionando uma sala e preenchendo os dados."
            action={
              salas.length > 0 ? (
                <Button onClick={handleCreate} className="gap-2">
                  <Plus className="h-4 w-4" />
                  Criar primeira reserva
                </Button>
              ) : undefined
            }
          />
        ) : (
          <EmptyState
            icon={CalendarRange}
            title="Nenhuma reserva encontrada"
            description="Nenhuma reserva corresponde aos filtros aplicados."
          />
        )
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredAndSorted.map((reserva) => (
            <ReservaCard
              key={reserva.id}
              reserva={reserva}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      <ReservaDialog
        open={dialogOpen}
        onOpenChange={handleDialogClose}
        reserva={selectedReserva}
        salas={salas}
        onCreate={createReserva}
        onUpdate={updateReserva}
      />

      <ReservaDeleteDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        reserva={reservaToDelete}
        onDelete={deleteReserva}
      />
    </div>
  )
}
