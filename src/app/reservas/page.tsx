'use client'

import { useState } from 'react'
import { CalendarRange, ChevronLeft, ChevronRight, Plus } from 'lucide-react'
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

const PAGE_SIZE = 12

export default function ReservasPage() {
  const { salas } = useSalas()

  const [selectedSalaId, setSelectedSalaId] = useState<string>('all')
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc')
  const [page, setPage] = useState(1)

  const [dialogOpen, setDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedReserva, setSelectedReserva] = useState<Reserva | undefined>()
  const [reservaToDelete, setReservaToDelete] = useState<Reserva | null>(null)

  const { reservas, total, totalPages, loading, error, fetchReservas, createReserva, updateReserva, deleteReserva } =
    useReservas({
      salaId: selectedSalaId !== 'all' ? selectedSalaId : undefined,
      page,
      pageSize: PAGE_SIZE,
      orderBy: sortOrder,
    })

  function handleSalaChange(salaId: string) {
    setSelectedSalaId(salaId)
    setPage(1)
  }

  function handleSortChange(order: SortOrder) {
    setSortOrder(order)
    setPage(1)
  }

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
        description={`${total} ${total === 1 ? 'reserva cadastrada' : 'reservas cadastradas'}`}
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

      <ReservaFilters
        salas={salas}
        selectedSalaId={selectedSalaId}
        sortOrder={sortOrder}
        onSalaChange={handleSalaChange}
        onSortChange={handleSortChange}
      />

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: PAGE_SIZE }).map((_, i) => (
            <ReservaCardSkeleton key={i} />
          ))}
        </div>
      ) : reservas.length === 0 && !error ? (
        total === 0 && selectedSalaId === 'all' ? (
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
          {reservas.map((reserva) => (
            <ReservaCard
              key={reserva.id}
              reserva={reserva}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => p - 1)}
            disabled={page <= 1 || loading}
            className="gap-1"
          >
            <ChevronLeft className="h-4 w-4" />
            Anterior
          </Button>
          <span className="text-sm text-gray-600">
            Página {page} de {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => p + 1)}
            disabled={page >= totalPages || loading}
            className="gap-1"
          >
            Próxima
            <ChevronRight className="h-4 w-4" />
          </Button>
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
