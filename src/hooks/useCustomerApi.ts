
import { useCallback, useEffect, useState } from 'react'
import { SET_CUSTOMERS } from '../context/customerReducer'
import { useCustomerContext } from '../context/useCustomerContext'
import sampleCustomers from '../data/sampleCustomers'
import type { Customer, CustomerFormData } from '../types/customer'

const CUSTOMERS_API_BASE_URL = '/api/customers'
const FALLBACK_MESSAGE = 'API is unavailable. Showing sample customer data.'
const DEMO_MODE_MESSAGE =
  'API is unavailable. Demo mode enabled with local customer changes.'

export function useCustomerApi() {
  const {
    state: { customers },
    dispatch,
  } = useCustomerContext()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isDemoMode, setIsDemoMode] = useState(false)

  const getNextCustomerId = useCallback((existingCustomers: Customer[]): number => {
    const highestCustomerId = existingCustomers.reduce(
      (currentHighest, customer) => Math.max(currentHighest, customer.id),
      0,
    )

    return highestCustomerId + 1
  }, [])

  const applyLocalAdd = useCallback(
    (formData: CustomerFormData): void => {
      const newCustomer: Customer = {
        id: getNextCustomerId(customers),
        ...formData,
      }

      dispatch({
        type: SET_CUSTOMERS,
        payload: [...customers, newCustomer],
      })
    },
    [customers, dispatch, getNextCustomerId],
  )

  const applyLocalUpdate = useCallback(
    (id: number, formData: CustomerFormData): void => {
      dispatch({
        type: SET_CUSTOMERS,
        payload: customers.map((customer) =>
          customer.id === id ? { id, ...formData } : customer,
        ),
      })
    },
    [customers, dispatch],
  )

  const applyLocalDelete = useCallback(
    (id: number): void => {
      dispatch({
        type: SET_CUSTOMERS,
        payload: customers.filter((customer) => customer.id !== id),
      })
    },
    [customers, dispatch],
  )

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
      setIsDemoMode(false)
      return data
    } catch {
      dispatch({ type: SET_CUSTOMERS, payload: sampleCustomers })
      setError(FALLBACK_MESSAGE)
      setIsDemoMode(true)
      return sampleCustomers
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
        setIsDemoMode(false)
      } catch {
        if (!isMounted) {
          return
        }

        dispatch({ type: SET_CUSTOMERS, payload: sampleCustomers })
        setError(FALLBACK_MESSAGE)
        setIsDemoMode(true)
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

      if (isDemoMode) {
        applyLocalAdd(formData)
        setError(DEMO_MODE_MESSAGE)
        setLoading(false)
        return
      }

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
        setIsDemoMode(true)
        applyLocalAdd(formData)
        setError(DEMO_MODE_MESSAGE)
      } finally {
        setLoading(false)
      }
    },
    [applyLocalAdd, fetchCustomers, isDemoMode],
  )

  const updateCustomer = useCallback(
    async (id: number, customer: CustomerFormData): Promise<void> => {
      setLoading(true)

      if (isDemoMode) {
        applyLocalUpdate(id, customer)
        setError(DEMO_MODE_MESSAGE)
        setLoading(false)
        return
      }

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
        setIsDemoMode(true)
        applyLocalUpdate(id, customer)
        setError(DEMO_MODE_MESSAGE)
      } finally {
        setLoading(false)
      }
    },
    [applyLocalUpdate, fetchCustomers, isDemoMode],
  )

  const deleteCustomer = useCallback(
    async (id: number): Promise<void> => {
      setLoading(true)

      if (isDemoMode) {
        applyLocalDelete(id)
        setError(DEMO_MODE_MESSAGE)
        setLoading(false)
        return
      }

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
        setIsDemoMode(true)
        applyLocalDelete(id)
        setError(DEMO_MODE_MESSAGE)
      } finally {
        setLoading(false)
      }
    },
    [applyLocalDelete, fetchCustomers, isDemoMode],
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