import { UserModel } from '@/models/user'

export async function getUserById(id: string) {
  const user = await UserModel.findById(id)
  if (!user) {
    throw new Error('User not found')
  }
  return user
}
