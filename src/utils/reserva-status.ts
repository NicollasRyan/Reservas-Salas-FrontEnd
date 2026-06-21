import type { ReservaStatus } from '@/types/reserva'

export function getReservaStatus(inicio: string, fim: string): ReservaStatus {
  const now = new Date()
  const start = new Date(inicio)
  const end = new Date(fim)

  if (now < start) return 'proxima'
  if (now > end) return 'encerrada'
  return 'em-andamento'
}

export const statusConfig: Record<
  ReservaStatus,
  { label: string; className: string; dotClassName: string }
> = {
  'em-andamento': {
    label: 'Em andamento',
    className: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20',
    dotClassName: 'bg-emerald-500',
  },
  proxima: {
    label: 'Próxima',
    className: 'bg-blue-50 text-blue-700 ring-blue-600/20',
    dotClassName: 'bg-blue-500',
  },
  encerrada: {
    label: 'Encerrada',
    className: 'bg-gray-100 text-gray-500 ring-gray-500/10',
    dotClassName: 'bg-gray-400',
  },
}
