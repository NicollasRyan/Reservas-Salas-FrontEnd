import { z } from 'zod'

export const salaSchema = z.object({
  nome: z.string().min(1, 'O nome é obrigatório'),
  capacidade: z
    .number({ error: 'A capacidade deve ser um número' })
    .int('A capacidade deve ser um número inteiro')
    .positive('A capacidade deve ser maior que zero'),
})

export type SalaFormData = z.infer<typeof salaSchema>

export const reservaSchema = z
  .object({
    titulo: z.string().min(1, 'O título é obrigatório'),
    participantes: z
      .number({ error: 'O número de participantes deve ser um número' })
      .int('O número de participantes deve ser inteiro')
      .positive('O número de participantes deve ser positivo'),
    salaId: z.string().min(1, 'Selecione uma sala'),
    inicio: z.string().min(1, 'A data/hora de início é obrigatória'),
    fim: z.string().min(1, 'A data/hora de fim é obrigatória'),
  })
  .refine(
    (data) => {
      if (!data.inicio || !data.fim) return true
      return new Date(data.fim) > new Date(data.inicio)
    },
    {
      message: 'A data/hora de fim deve ser posterior à de início',
      path: ['fim'],
    }
  )

export type ReservaFormData = z.infer<typeof reservaSchema>
