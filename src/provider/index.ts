import React from 'react'

interface FormMetaProviderType {
  loading: boolean
  // true only while a form is opening with saved details (Edit shipment).
  // Fields check it so they don't clear the saved values on first load.
  isPrefilling?: React.MutableRefObject<boolean>
}
export const FormMetaProvider = React.createContext<FormMetaProviderType>(
  {} as unknown as FormMetaProviderType
)
