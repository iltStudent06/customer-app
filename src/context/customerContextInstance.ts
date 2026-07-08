import { createContext, type Dispatch } from 'react'
import type { CustomerAction, CustomerState } from './customerReducer'

// Shape of the value provided through CustomerContext.
// Includes current state and reducer dispatch for updates.
export interface CustomerContextValue {
  state: CustomerState
  dispatch: Dispatch<CustomerAction>
}

// Context instance for sharing customer reducer state across the app.
// Starts as undefined so consuming hooks can detect missing provider usage.
export const CustomerContext = createContext<CustomerContextValue | undefined>(
  undefined,
)
