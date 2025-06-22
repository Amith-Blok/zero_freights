import mongoosedb from '@/lib/mongoose-db'
import lclSeaFreight from '@/models/lcl-sea-freight'

/**
 * Retrieves the LCL sea freight cost based on the provided code
 * @param code - The unique identifier for the LCL sea freight rate
 * @returns Promise containing the LCL sea freight cost details
 */
export async function getLCLSeaFreightCostByCode(
  code: string
): Promise<number> {
  try {
    // Input validation
    if (!code) {
      throw new Error('Code is required')
    }
    await mongoosedb()
    // Make API call or database query to fetch the cost
    const response = await lclSeaFreight
      .findOne({
        port_code: code,
      })
      .select('lcl_cost')

    if (!response) {
      throw new Error(`No LCL sea freight cost found for code: ${code}`)
    }

    return response.lcl_cost as number
  } catch (error) {
    console.error('Error fetching LCL sea freight cost:', error)
    throw error
  }
}
