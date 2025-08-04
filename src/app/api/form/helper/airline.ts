import { AirlineType } from '@/models/air-freight'

export const getCheapestAirLineRecord = (
  airlines: AirlineType[]
): AirlineType => {
  return airlines.reduce((cheap, airline) => {
    return airline.value < cheap.value ? airline : cheap
  }, airlines[0])
}
