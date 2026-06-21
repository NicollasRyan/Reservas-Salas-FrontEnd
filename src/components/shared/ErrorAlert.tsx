import { AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface ErrorAlertProps {
  message: string
  onRetry?: () => void
}

export function ErrorAlert({ message, onRetry }: ErrorAlertProps) {
  return (
    <div className="rounded-lg border border-red-200 bg-red-50 p-4">
      <div className="flex items-start gap-3">
        <AlertCircle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
        <div className="flex-1 flex flex-col gap-2">
          <p className="text-sm font-medium text-red-800">Erro ao carregar dados</p>
          <p className="text-sm text-red-700">{message}</p>
          {onRetry && (
            <Button variant="outline" size="sm" onClick={onRetry} className="self-start mt-1">
              Tentar novamente
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
