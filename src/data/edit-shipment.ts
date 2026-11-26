import { getOfferById } from '@/data/offer/offer'
import { getFormById } from '@/data/form'

/**
 * Loads the sea form details that were used to create an offer,
 * so the user can edit them instead of typing everything again.
 * Returns null if the offer is not an Ocean FCL offer, does not belong
 * to the user, or anything goes wrong (the form then opens empty).
 */
export const getSeaFormDataForEdit = async (params: {
  offerId: string
  userId: string
}): Promise<Record<string, unknown> | null> => {
  const { offerId, userId } = params
  try {
    const offer = await getOfferById(offerId)
    // Only the owner of the offer can load its details
    if (offer.user_id !== userId) return null
    // For now only Ocean FCL offers can be edited
    if (offer.mode !== 'SEA_FCL') return null

    const form = await getFormById(offer.form_id)
    // Some routes save { success, data: {...} }, others save the data directly
    const saved = form.data as Record<string, unknown>
    const data =
      saved.success === true && saved.data && typeof saved.data === 'object'
        ? (saved.data as Record<string, unknown>)
        : saved
    if (data.modes !== 'FCL') return null
    return data
  } catch (error) {
    console.log('could not load form for edit', error)
    return null
  }
}
