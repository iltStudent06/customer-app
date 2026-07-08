import type { Customer } from '../types/customer'

// Action type constants for customer state transitions.
export const ADD_CUSTOMER = 'ADD_CUSTOMER' as const
export const UPDATE_CUSTOMER = 'UPDATE_CUSTOMER' as const
export const DELETE_CUSTOMER = 'DELETE_CUSTOMER' as const
export const SET_CUSTOMERS = 'SET_CUSTOMERS' as const

// Shape of the customer reducer state.
export interface CustomerState {
  customers: Customer[]
}

// Discriminated union of all actions the reducer accepts.
export type CustomerAction =
  | { type: typeof ADD_CUSTOMER; payload: Customer }
  | { type: typeof UPDATE_CUSTOMER; payload: Customer }
  | { type: typeof DELETE_CUSTOMER; payload: number }
  | { type: typeof SET_CUSTOMERS; payload: Customer[] }

// Initial reducer state used at app startup.
export const initialCustomerState: CustomerState = {
  customers: [],
}

// Pure reducer function that returns next state based on action type.
export function customerReducer(
  state: CustomerState,
  action: CustomerAction,
): CustomerState {
  switch (action.type) {
    // Appends a newly created customer to the list.
    case ADD_CUSTOMER:
      return {
        ...state,
        customers: [...state.customers, action.payload],
      }
    // Replaces a matching customer record with updated data.
    case UPDATE_CUSTOMER:
      return {
        ...state,
        customers: state.customers.map((customer) =>
          customer.id === action.payload.id ? action.payload : customer,
        ),
      }
    // Removes a customer by id.
    case DELETE_CUSTOMER:
      return {
        ...state,
        customers: state.customers.filter((customer) => customer.id !== action.payload),
      }
    // Replaces the full customer collection (e.g., after fetch).
    case SET_CUSTOMERS:
      return {
        ...state,
        customers: action.payload,
      }
    // Returns existing state for unknown action types.
    default:
      return state
  }
}
