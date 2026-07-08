import { useReducer, type ReactNode } from 'react'
import { CustomerContext } from './customerContextInstance'
import { customerReducer, initialCustomerState } from './customerReducer'

// Props for the context provider: wraps any child component tree.
interface CustomerProviderProps {
  children: ReactNode
}

// Provides customer state and dispatch function to descendants.
// Uses reducer-based state management for predictable state transitions.
export function CustomerProvider({ children }: CustomerProviderProps) {
  // Initialize reducer with default customer state.
  const [state, dispatch] = useReducer(customerReducer, initialCustomerState)

  // Expose state + dispatch through React Context provider.
  return (
    <CustomerContext.Provider value={{ state, dispatch }}>
      {children}
    </CustomerContext.Provider>
  )
}
