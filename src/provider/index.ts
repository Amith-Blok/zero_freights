import React from 'react'

interface FormMetaProviderType {
  loading: boolean
}
export const FormMetaProvider = React.createContext<FormMetaProviderType>(
  {} as unknown as FormMetaProviderType
)
