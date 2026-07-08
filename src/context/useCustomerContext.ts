import { useContext } from 'react'
import { CustomerContext } from './customerContextInstance'

// Convenience hook for consuming customer context values.
export function useCustomerContext() {
  // Read current context value from nearest CustomerProvider.
  const context = useContext(CustomerContext)

  // Guard against usage outside provider to surface configuration issues early.
  if (!context) {
    throw new Error('useCustomerContext must be used within a CustomerProvider')
  }

  // Return strongly-typed state + dispatch context object.
  return context
}
