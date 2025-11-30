import mongoosedb from '@/lib/mongoose-db'
import form from '@/models/form'
import { FormZodSchema, FormType } from '@/schema/models/form-zod'

export const createForm = async (data: Object): Promise<string> => {
  if (!data) {
    console.log('missing data while create form')
    throw Error('Missing data while create form')
  }
  await mongoosedb()

  const response = await form.create({ data, created_at: new Date() })
  if (!response) {
    throw Error("couldn't create form something went wrong")
  }
  console.log('Success from created', response._id)

  return response._id.toString()
}

export const getFormById = async (id: string): Promise<FormType> => {
  await mongoosedb()
  const response = await form.findById(id).lean()
  if (!response) {
    throw Error('form not found')
  }
  const vaildData = FormZodSchema.safeParse(response)
  if (!vaildData.success) {
    console.log({ error: JSON.stringify(vaildData.error) })
    throw 'invalid get form data'
  }
  return vaildData.data
}
