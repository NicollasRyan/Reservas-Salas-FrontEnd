'use client'

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import { salaSchema, type SalaFormData } from '@/lib/validations'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import type { Sala } from '@/types/sala'

interface SalaFormProps {
  defaultValues?: Sala
  onSubmit: (data: SalaFormData) => Promise<void>
  onCancel: () => void
  isSubmitting?: boolean
}

export function SalaForm({ defaultValues, onSubmit, onCancel, isSubmitting }: SalaFormProps) {
  const form = useForm<SalaFormData>({
    resolver: zodResolver(salaSchema),
    defaultValues: {
      nome: defaultValues?.nome ?? '',
      capacidade: defaultValues?.capacidade ?? ('' as unknown as number),
    },
  })

  useEffect(() => {
    if (defaultValues) {
      form.reset({
        nome: defaultValues.nome,
        capacidade: defaultValues.capacidade,
      })
    }
  }, [defaultValues, form])

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <FormField
          control={form.control}
          name="nome"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome da Sala</FormLabel>
              <FormControl>
                <Input placeholder="Ex: Sala de Reunião A" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="capacidade"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Capacidade</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min={1}
                  placeholder="Ex: 10"
                  {...field}
                  onChange={(e) => field.onChange(e.target.valueAsNumber)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-end">
          <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
            Cancelar
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
            {defaultValues ? 'Salvar alterações' : 'Criar sala'}
          </Button>
        </div>
      </form>
    </Form>
  )
}
