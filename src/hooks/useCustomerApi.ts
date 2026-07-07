
import { useCallback, useEffect, useState } from 'react'
import { SET_CUSTOMERS } from '../context/customerReducer'
import { useCustomerContext } from '../context/useCustomerContext'
import type { Customer, CustomerFormData } from '../types/customer'

const CUSTOMERS_API_BASE_URL = '/api/customers'

export function useCustomerApi() {
  const {
    state: { customers },
    dispatch,
  } = useCustomerContext()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchCustomers = useCallback(async (): Promise<Customer[]> => {
    setLoading(true)

    try {
      const response = await fetch(CUSTOMERS_API_BASE_URL)

      if (!response.ok) {
        throw new Error(`Request failed: ${response.status}`)
      }

      const data: Customer[] = await response.json()
      dispatch({ type: SET_CUSTOMERS, payload: data })
      setError(null)
      return data
    } catch {
      setError('Unable to load customers. Please try again.')
      throw new Error('Unable to load customers. Please try again.')
    } finally {
      setLoading(false)
    }
  }, [dispatch])

  useEffect(() => {
    let isMounted = true

    async function loadCustomersOnMount() {
      try {
        const response = await fetch(CUSTOMERS_API_BASE_URL)

        if (!response.ok) {
          throw new Error(`Request failed: ${response.status}`)
        }

        const data: Customer[] = await response.json()

        if (!isMounted) {
          return
        }

        dispatch({ type: SET_CUSTOMERS, payload: data })
        setError(null)
      } catch {
        if (!isMounted) {
          return
        }

        setError('Unable to load customers. Please try again.')
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    void loadCustomersOnMount()

    return () => {
      isMounted = false
    }
  }, [dispatch])

  const addCustomer = useCallback(
    async (formData: CustomerFormData): Promise<void> => {
      setLoading(true)
      setError(null)

      try {
        const response = await fetch(CUSTOMERS_API_BASE_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        })

        if (!response.ok) {
          throw new Error(`Request failed: ${response.status}`)
        }

        await fetchCustomers()
      } catch {
        setError('Unable to add customer. Please try again.')
        throw new Error('Unable to add customer. Please try again.')
      } finally {
        setLoading(false)
      }
    },
    [fetchCustomers],
  )

  const updateCustomer = useCallback(
    async (id: number, customer: CustomerFormData): Promise<void> => {
      setLoading(true)
      setError(null)

      try {
        const response = await fetch(`${CUSTOMERS_API_BASE_URL}/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(customer),
        })

        if (!response.ok) {
          throw new Error(`Request failed: ${response.status}`)
        }

        await fetchCustomers()
      } catch {
        setError('Unable to update customer. Please try again.')
        throw new Error('Unable to update customer. Please try again.')
      } finally {
        setLoading(false)
      }
    },
    [fetchCustomers],
  )

  const deleteCustomer = useCallback(
    async (id: number): Promise<void> => {
      setLoading(true)
      setError(null)

      try {
        const response = await fetch(`${CUSTOMERS_API_BASE_URL}/${id}`, {
          method: 'DELETE',
        })

        if (!response.ok) {
          throw new Error(`Request failed: ${response.status}`)
        }

        await fetchCustomers()
      } catch {
        setError('Unable to delete customer. Please try again.')
        throw new Error('Unable to delete customer. Please try again.')
      } finally {
        setLoading(false)
      }
    },
    [fetchCustomers],
  )

  return {
    customers,
    loading,
    error,
    fetchCustomers,
    addCustomer,
    updateCustomer,
    deleteCustomer,
  }
}