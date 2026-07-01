import type { Customer, CustomerFormData } from '../types/customer'

const CUSTOMERS_API_URL = 'http://localhost:3001/customers'

async function request<T>(input: string, init?: RequestInit): Promise<T> {
  const response = await fetch(input, init)

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`)
  }

  return (await response.json()) as T
}

export async function getCustomers(): Promise<Customer[]> {
  return request<Customer[]>(CUSTOMERS_API_URL)
}

export async function getCustomerById(id: number): Promise<Customer> {
  return request<Customer>(`${CUSTOMERS_API_URL}/${id}`)
}

export async function createCustomer(payload: CustomerFormData): Promise<Customer> {
  return request<Customer>(CUSTOMERS_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })
}

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

export async function deleteCustomer(id: number): Promise<void> {
  const response = await fetch(`${CUSTOMERS_API_URL}/${id}`, {
    method: 'DELETE',
  })

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`)
  }
}