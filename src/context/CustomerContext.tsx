import { useReducer, type ReactNode } from 'react'
import { CustomerContext } from './customerContextInstance'
import { customerReducer, initialCustomerState } from './customerReducer'

interface CustomerProviderProps {
  children: ReactNode
}

export function CustomerProvider({ children }: CustomerProviderProps) {
  const [state, dispatch] = useReducer(customerReducer, initialCustomerState)

  return (
    <CustomerContext.Provider value={{ state, dispatch }}>
      {children}
    </CustomerContext.Provider>
  )
}
