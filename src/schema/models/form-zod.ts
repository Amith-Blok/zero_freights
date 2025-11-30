import { z } from 'zod'

export const FormZodSchema = z.object({
  data: z.object({}).passthrough(),
  created_at: z
    .union([z.string(), z.date()])
    .transform((val) => (val instanceof Date ? val.toISOString() : val)),
})

export type FormType = z.infer<typeof FormZodSchema>
