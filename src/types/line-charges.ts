export type SectionDataType = {
  name: string
  code: string
  currency: string
  is_considered_for_total?: string
  additional_notes?: string
  d2: number
  d4: number
  d5: number
}
export type SectionType = {
  name: string
  label: string
  data: SectionDataType[]
}
export type RoutingType = {
  location_name: string
  locode: string
  country_code: string
  mode_of_transport?: string
  point_usage?: string
  is_sea_port?: boolean
}
export type LineType = {
  line_name: string
  quotation_number: string
  estimated_days: number
  valid_to: string
  routing: RoutingType[]
  sections: SectionType[]
}
export type LinesChargesType = {
  start_code: string
  end_code: string
  available_lines: string[]
  lines: LineType[]
}
