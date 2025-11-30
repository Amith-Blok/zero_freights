import z from 'zod'

export const ProfileSettingsSchema = z.object({
  companyName: z.string().min(1, { message: 'Company name is required' }),
  phone: z.string().min(1, { message: 'Phone is required' }),
})

export type ProfileSettingsType = z.infer<typeof ProfileSettingsSchema>
