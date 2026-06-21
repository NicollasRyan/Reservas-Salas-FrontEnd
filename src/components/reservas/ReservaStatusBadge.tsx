import { cn } from '@/lib/utils'
import { getReservaStatus, statusConfig } from '@/utils/reserva-status'

interface ReservaStatusBadgeProps {
  inicio: string
  fim: string
  className?: string
}

export function ReservaStatusBadge({ inicio, fim, className }: ReservaStatusBadgeProps) {
  const status = getReservaStatus(inicio, fim)
  const config = statusConfig[status]

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset',
        config.className,
        className
      )}
    >
      <span className={cn('h-1.5 w-1.5 rounded-full', config.dotClassName)} />
      {config.label}
    </span>
  )
}
