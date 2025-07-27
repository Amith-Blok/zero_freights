import mongoosedb from '@/lib/mongoose-db'
import { DutiesModel } from '@/models/duties'

//TODO: use type for country
export const getDutyByHsCodeCountry = async (
  hs_code: string,
  country: string
): Promise<number | Error> => {
  await mongoosedb()
  const duty = await DutiesModel.findOne({ hs_code, country })
  if (!duty) {
    throw new Error(
      `Duty not found for hs_code: ${hs_code} and country: ${country}`
    )
  }
  return duty.value
}
