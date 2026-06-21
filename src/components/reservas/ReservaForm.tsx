'use client'

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import { reservaSchema, type ReservaFormData } from '@/lib/validations'
import { toDatetimeLocalValue } from '@/utils/date'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { Reserva } from '@/types/reserva'
import type { Sala } from '@/types/sala'

interface ReservaFormProps {
  defaultValues?: Reserva
  salas: Sala[]
  onSubmit: (data: ReservaFormData) => Promise<void>
  onCancel: () => void
  isSubmitting?: boolean
}

export function ReservaForm({
  defaultValues,
  salas,
  onSubmit,
  onCancel,
  isSubmitting,
}: ReservaFormProps) {
  const form = useForm<ReservaFormData>({
    resolver: zodResolver(reservaSchema),
    defaultValues: {
      titulo: defaultValues?.titulo ?? '',
      participantes: defaultValues?.participantes ?? ('' as unknown as number),
      salaId: defaultValues?.salaId ?? '',
      inicio: defaultValues ? toDatetimeLocalValue(defaultValues.inicio) : '',
      fim: defaultValues ? toDatetimeLocalValue(defaultValues.fim) : '',
    },
  })

  useEffect(() => {
    if (defaultValues) {
      form.reset({
        titulo: defaultValues.titulo,
        participantes: defaultValues.participantes,
        salaId: defaultValues.salaId,
        inicio: toDatetimeLocalValue(defaultValues.inicio),
        fim: toDatetimeLocalValue(defaultValues.fim),
      })
    }
  }, [defaultValues, form])

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <FormField
          control={form.control}
          name="titulo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Título</FormLabel>
              <FormControl>
                <Input placeholder="Ex: Reunião de planejamento" className="bg-white text-gray-900" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="salaId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Sala</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma sala" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {salas.map((sala) => (
                    <SelectItem key={sala.id} value={sala.id}>
                      {sala.nome} — {sala.capacidade} vagas
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="participantes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Número de participantes</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min={1}
                  placeholder="Ex: 5"
                  {...field}
                  onChange={(e) => field.onChange(e.target.valueAsNumber)}
                  className="bg-white text-gray-900"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="inicio"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Data/hora início</FormLabel>
                <FormControl>
                  <Input type="datetime-local" className="bg-white text-gray-900" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="fim"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Data/hora fim</FormLabel>
                <FormControl>
                  <Input type="datetime-local" className="bg-white text-gray-900" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-end">
          <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
            Cancelar
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
            {defaultValues ? 'Salvar alterações' : 'Criar reserva'}
          </Button>
        </div>
      </form>
    </Form>
  )
}
