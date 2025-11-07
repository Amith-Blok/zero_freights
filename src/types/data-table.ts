export type MetaType = {
  key: string
  header: string
  type: 'string' | 'number' | 'date' | 'boolean' | 'json' | 'list'
  size?: number
  meta?: Record<string, string>
}
