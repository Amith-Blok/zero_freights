import mongoosedb from '@/lib/mongoose-db'
import seaPorts, { SeaPortsType } from '@/models/sea-ports'

export async function getAllSeaPortsByCountry(
  country: string
): Promise<SeaPortsType> {
  await mongoosedb()
  const response = await seaPorts
    .find({ port_country: country })
    .lean<SeaPortsType>()
  // console.log({ response });
  if (!response) {
    throw Error('no response getAllSeaPortsByCountry data fn')
  }
  return response
}
export async function getNearestSeaPortsByCountry({
  country,
  lat,
  lng,
  isPort,
}: {
  country: string
  lat: number | null
  lng: number | null
  isPort?: boolean
}): Promise<SeaPortsType> {
  await mongoosedb()

  const query: any = { port_country: country }

  if (isPort) {
    query.port_type = 'PORT'
  }
  if (lat !== null && lng !== null) {
    query.location = {
      $near: {
        $geometry: {
          type: 'Point',
          coordinates: [lng, lat],
        },
      },
    }
  }

  const response = await seaPorts.find(query).lean<SeaPortsType>()

  if (!response) {
    throw new Error('No response from getNearestSeaPortsByCountry')
  }

  return response
}

// NOTE: IND HAULAGE BOTH IMPORT AND EXPORT
export async function neartestSeaPortFromRail({
  country,
  portCode,
  haulageType,
}: {
  country: string
  portCode: string
  haulageType: string
}): Promise<SeaPortsType> {
  await mongoosedb()
  const response = await seaPorts
    .findOne({
      port_country: country,
      port_type: 'RAIL',
      port_code: portCode,
      haulage_type: haulageType,
    })
    .lean<SeaPortsType>()

  if (!response) {
    throw Error('no response getAllSeaPortsByCountry data fn')
  }
  return response
}
