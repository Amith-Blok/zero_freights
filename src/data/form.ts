import mongoosedb from '@/lib/mongoose-db'
import form from '@/models/form'

export const createForm = async (data: Object) => {
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
  return response._id
}
