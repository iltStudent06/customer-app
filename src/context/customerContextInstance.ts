import { createContext, type Dispatch } from 'react'
import type { CustomerAction, CustomerState } from './customerReducer'

export interface CustomerContextValue {
  state: CustomerState
  dispatch: Dispatch<CustomerAction>
}

export const CustomerContext = createContext<CustomerContextValue | undefined>(
  undefined,
)
