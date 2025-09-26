import mongoosedb from '@/lib/mongoose-db'
import { formatPhoneNumber, toTitleCase } from '@/lib/utils'
import { UserModel } from '@/models/user'

export async function getUserById(id: string) {
  await mongoosedb()
  const user = await UserModel.findById(id)
  if (!user) {
    throw new Error('User not found')
  }
  return user
}

export async function updateUserCompanyNameAndPhone(
  id: string,
  companyName: string,
  phone: string
) {
  const blokVerified = new Date().toISOString()
  const formattedPhone = formatPhoneNumber(phone)
  const formattedCompanyName = toTitleCase(companyName)
  await mongoosedb()
  const user = await UserModel.findOneAndUpdate(
    { _id: id },
    {
      companyName: formattedCompanyName,
      phone: formattedPhone,
      blokVerified: blokVerified,
    },
    { new: true }
  )
  if (!user) {
    throw new Error('User not found')
  }
  return user
}
