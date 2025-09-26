'use server'
import { updateUserCompanyNameAndPhone } from '@/data/user'

export async function blokVerificationAction(
  userId: string,
  companyName: string,
  phone: string
) {
  try {
    console.log({ userId, companyName, phone })
    const response = await updateUserCompanyNameAndPhone(
      userId,
      companyName,
      phone
    )
    if (!response) {
      throw new Error('Failed to update user company name and phone')
    }
    return { success: true }
  } catch (error) {
    console.log(error)
    return { error: error }
  }
}
