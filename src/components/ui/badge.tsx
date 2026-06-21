import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset transition-colors',
  {
    variants: {
      variant: {
        default: 'bg-blue-50 text-blue-700 ring-blue-600/20',
        secondary: 'bg-gray-100 text-gray-600 ring-gray-500/10',
        destructive: 'bg-red-50 text-red-700 ring-red-600/20',
        success: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20',
        outline: 'bg-transparent text-gray-700 ring-gray-300',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />
}

export { Badge, badgeVariants }
