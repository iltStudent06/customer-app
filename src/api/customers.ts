import type { Customer, CustomerFormData } from '../types/customer'

// Base endpoint for customer resources in the JSON server API.
const CUSTOMERS_API_URL = 'http://localhost:3001/customers'

// Shared request helper used by read/create/update calls.
// It performs the fetch, throws on non-2xx responses, and returns parsed JSON.
async function request<T>(input: string, init?: RequestInit): Promise<T> {
  const response = await fetch(input, init)

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`)
  }

  return (await response.json()) as T
}

// Retrieve all customers.
export async function getCustomers(): Promise<Customer[]> {
  return request<Customer[]>(CUSTOMERS_API_URL)
}

// Retrieve one customer by numeric ID.
export async function getCustomerById(id: number): Promise<Customer> {
  return request<Customer>(`${CUSTOMERS_API_URL}/${id}`)
}

// Create a new customer record with form payload data.
export async function createCustomer(payload: CustomerFormData): Promise<Customer> {
  return request<Customer>(CUSTOMERS_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })
}

// Replace an existing customer record by ID.
export async function updateCustomer(
  id: number,
  payload: CustomerFormData,
): Promise<Customer> {
  return request<Customer>(`${CUSTOMERS_API_URL}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })
}

// Delete a customer by ID.
export async function deleteCustomer(id: number): Promise<void> {
  const response = await fetch(`${CUSTOMERS_API_URL}/${id}`, {
    method: 'DELETE',
  })

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`)
  }
}