// import { COUNTRIES } from '@/constants';
import mongoosedb from '@/lib/mongoose-db'
import warehouse, { WarehousesType } from '@/models/warehouses'

export async function nearestWarehouse({
  country,
  lat,
  lng,
}: {
  country: string
  lat: number
  lng: number
}) {
  if (!country || !lat || !lng) {
    throw new Error("country param can't be null or invalid type")
  }
  const response = (await warehouse.find({
    port_country: country,
    location: {
      $near: {
        $geometry: {
          type: 'Point',
          coordinates: [lng, lat],
        },
      },
    },
  })) as WarehousesType[]
  if (!response) {
    throw new Error('no response for nearest warehouses')
  }
  return response
}

export const getWarehouseByPortCode = async (portCode: string) => {
  try {
    console.log({ portCode })
    if (!portCode) {
      throw new Error('portCode not found')
    }

    await mongoosedb()
    const response = await warehouse
      .findOne({ port_code: portCode })
      .lean<WarehousesType>()
    if (!response) {
      throw new Error('portCode not found')
    }
    return response
  } catch (error) {
    console.log({ error })
    throw new Error('error occur at getWarehouseByPortCode')
  }
}
