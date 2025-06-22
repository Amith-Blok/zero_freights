import mongoosedb from '@/lib/mongoose-db'
import UsLtlCities, { UsLtlCitiesType } from '@/models/us-ltl-cities'

export async function usLtlCitiesAutocompletion(query: string) {
  await mongoosedb()
  const response = (await UsLtlCities.aggregate([
    {
      $search: {
        index: 'default',
        text: {
          query: query,
          path: {
            wildcard: '*',
          },
        },
      },
    },

    {
      $limit: 5,
    },
  ])) as UsLtlCitiesType[]

  if (!response) {
    throw Error('could not fetch us lcl cities')
  }
  // console.log({ response });
  return response
}

export async function getUsLtlCityByZipcode(zipcode: string) {
  if (!zipcode) {
    throw new Error('missing zipcode getUsCitiesByZipcode')
  }
  const response = UsLtlCities.findOne({ zipcode }).lean<UsLtlCitiesType>()
  if (!response) {
    throw new Error('not data Found')
  }
  return response
}

export async function getNearestUsCityByLatLng({
  lat,
  lng,
}: {
  lat: number
  lng: number
}) {
  if (!lat || !lng) {
    throw new Error('missing lat and lng for getNearestUsCityByLatLng')
  }
  const response = UsLtlCities.findOne({
    location: {
      $near: {
        $geometry: {
          type: 'Point',
          coordinates: [lng, lat],
        },
      },
    },
  }).lean<UsLtlCitiesType>()
  if (!response) {
    throw new Error('not data Found')
  }
  return response
}
