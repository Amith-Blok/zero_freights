import mongoosedb from '@/lib/mongoose-db'
import AirPorts, { AirPortsType } from '@/models/air-ports'

export async function getNearByAirPorts(
  country: string,
  lat: number,
  lng: number
) {
  await mongoosedb()
  const response = (await AirPorts.find({
    port_country: country,
    location: {
      $near: {
        $geometry: {
          type: 'Point',
          coordinates: [lng, lat],
        },
      },
    },
  })) as AirPortsType[]
  if (!response) {
    throw Error('could not fetch air ports')
  }
  return response
}

export async function getAllAirportByCountry(country: string) {
  await mongoosedb()
  const response = (await AirPorts.find({
    port_country: country,
  })) as AirPortsType[]
  if (!response) {
    throw Error('could not fetch air ports')
  }
  return response
}
