import type { Customer } from '../types/customer'

export const ADD_CUSTOMER = 'ADD_CUSTOMER' as const
export const UPDATE_CUSTOMER = 'UPDATE_CUSTOMER' as const
export const DELETE_CUSTOMER = 'DELETE_CUSTOMER' as const
export const SET_CUSTOMERS = 'SET_CUSTOMERS' as const

export interface CustomerState {
  customers: Customer[]
}

export type CustomerAction =
  | { type: typeof ADD_CUSTOMER; payload: Customer }
  | { type: typeof UPDATE_CUSTOMER; payload: Customer }
  | { type: typeof DELETE_CUSTOMER; payload: number }
  | { type: typeof SET_CUSTOMERS; payload: Customer[] }

export const initialCustomerState: CustomerState = {
  customers: [],
}

export function customerReducer(
  state: CustomerState,
  action: CustomerAction,
): CustomerState {
  switch (action.type) {
    case ADD_CUSTOMER:
      return {
        ...state,
        customers: [...state.customers, action.payload],
      }
    case UPDATE_CUSTOMER:
      return {
        ...state,
        customers: state.customers.map((customer) =>
          customer.id === action.payload.id ? action.payload : customer,
        ),
      }
    case DELETE_CUSTOMER:
      return {
        ...state,
        customers: state.customers.filter((customer) => customer.id !== action.payload),
      }
    case SET_CUSTOMERS:
      return {
        ...state,
        customers: action.payload,
      }
    default:
      return state
  }
}
