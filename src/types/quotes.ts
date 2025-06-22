export type DataType = {
  label: string
  code: string
  category: string
  cost_usd: number
  cost_inr: number
  gst_percentage: number
  gst_amount: number
  total_amount: number
}

export type QuoteType = {
  user_id: string
  user_name: string
  user_company: string
  subject: string
  place_of_supply: string
  bill_to: string
  total_inr: number
  sub_total_inr_cost: number
  gst_five_inr_cost: number
  gst_eighteen_inr_cost: number
  total_usd: number
  quote_date: Date
  line: string
  blok_quote_id: string
  line_quotation_number: string
  estimated_day: number
  valid_from: string
  valid_to: string
  routing: any[] // or define a specific type if you know the structure
  data: DataType[] // Array of Data objects
  form_data: any // Define form_data type if you know the structure
}
