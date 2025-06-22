import { AirlineType } from '@/models/air-freight'

export const getCheapestAirLineRecord = (
  airlines: AirlineType[]
): AirlineType => {
  return airlines.reduce((cheap, airline) => {
    return airline.cost < cheap.cost ? airline : cheap
  }, airlines[0])
}
