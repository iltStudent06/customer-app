import { useCallback, useEffect, useRef, useState } from 'react'
import { SET_CUSTOMERS } from '../context/customerReducer'
import { useCustomerContext } from '../context/useCustomerContext'
import sampleCustomers from '../data/sampleCustomers'
import type { Customer, CustomerFormData } from '../types/customer'

const CUSTOMERS_API_BASE_URL = '/api/customers'
const FALLBACK_MESSAGE = 'API is unavailable. Showing sample customer data.'
const DEMO_MODE_MESSAGE =
  'API is unavailable. Demo mode enabled with local customer changes.'
const DEFAULT_PAGE = 1
const DEFAULT_LIMIT = 10

type CustomerSortField = 'name' | 'email' | 'city' | 'state'
type CustomerSortDirection = 'asc' | 'desc'

type FetchCustomersOptions = {
  page?: number
  limit?: number
  searchQuery?: string
  sortField?: CustomerSortField
  sortDirection?: CustomerSortDirection
}

type CustomerQuery = {
  page: number
  limit: number
  searchQuery: string
  sortField: CustomerSortField
  sortDirection: CustomerSortDirection
}

const DEFAULT_QUERY: CustomerQuery = {
  page: DEFAULT_PAGE,
  limit: DEFAULT_LIMIT,
  searchQuery: '',
  sortField: 'name',
  sortDirection: 'asc',
}

function getPaginatedCustomers(
  allCustomers: Customer[],
  page: number,
  limit: number,
): Customer[] {
  const startIndex = (page - 1) * limit
  return allCustomers.slice(startIndex, startIndex + limit)
}

function normalizeQuery(
  options: FetchCustomersOptions,
  currentQuery: CustomerQuery,
): CustomerQuery {
  return {
    page: options.page ?? currentQuery.page,
    limit: options.limit ?? currentQuery.limit,
    searchQuery: options.searchQuery ?? currentQuery.searchQuery,
    sortField: options.sortField ?? currentQuery.sortField,
    sortDirection: options.sortDirection ?? currentQuery.sortDirection,
  }
}

function applyDemoQuery(
  allCustomers: Customer[],
  query: CustomerQuery,
): { items: Customer[]; total: number; page: number } {
  const searchTerms = query.searchQuery
    .trim()
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)

  const filteredCustomers =
    searchTerms.length === 0
      ? allCustomers
      : allCustomers.filter((customer) => {
          const searchableContent = `${customer.name} ${customer.email} ${customer.city}`.toLowerCase()

          return searchTerms.every((searchTerm) => searchableContent.includes(searchTerm))
        })

  const sortedCustomers = [...filteredCustomers].sort((firstCustomer, secondCustomer) => {
    const firstValue = firstCustomer[query.sortField].toLowerCase()
    const secondValue = secondCustomer[query.sortField].toLowerCase()

    if (firstValue === secondValue) {
      return 0
    }

    if (query.sortDirection === 'asc') {
      return firstValue.localeCompare(secondValue)
    }

    return secondValue.localeCompare(firstValue)
  })

  const total = sortedCustomers.length
  const totalPages = Math.max(1, Math.ceil(total / query.limit))
  const page = Math.min(query.page, totalPages)

  return {
    items: getPaginatedCustomers(sortedCustomers, page, query.limit),
    total,
    page,
  }
}

export function useCustomerApi() {
  const {
    state: { customers },
    dispatch,
  } = useCustomerContext()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isDemoMode, setIsDemoMode] = useState(false)
  const [totalCustomers, setTotalCustomers] = useState(0)
  const [demoCustomers, setDemoCustomers] = useState<Customer[]>(sampleCustomers)
  const lastQueryRef = useRef<CustomerQuery>(DEFAULT_QUERY)
  const hasLoadedOnMountRef = useRef(false)

  const getNextCustomerId = useCallback((existingCustomers: Customer[]): number => {
    const highestCustomerId = existingCustomers.reduce(
      (currentHighest, customer) => Math.max(currentHighest, customer.id),
      0,
    )

    return highestCustomerId + 1
  }, [])

  const applyLocalAdd = useCallback(
    (formData: CustomerFormData, query: CustomerQuery): void => {
      const newCustomer: Customer = {
        id: getNextCustomerId(demoCustomers),
        ...formData,
      }

      const nextCustomers = [...demoCustomers, newCustomer]
      const { items, total, page } = applyDemoQuery(nextCustomers, query)

      lastQueryRef.current = { ...query, page }
      setDemoCustomers(nextCustomers)
      setTotalCustomers(total)
      dispatch({
        type: SET_CUSTOMERS,
        payload: items,
      })
    },
    [demoCustomers, dispatch, getNextCustomerId],
  )

  const applyLocalUpdate = useCallback(
    (id: number, formData: CustomerFormData, query: CustomerQuery): void => {
      const nextCustomers = demoCustomers.map((customer) =>
        customer.id === id ? { id, ...formData } : customer,
      )
      const { items, total, page } = applyDemoQuery(nextCustomers, query)

      lastQueryRef.current = { ...query, page }
      setDemoCustomers(nextCustomers)
      setTotalCustomers(total)
      dispatch({
        type: SET_CUSTOMERS,
        payload: items,
      })
    },
    [demoCustomers, dispatch],
  )

  const applyLocalDelete = useCallback(
    (id: number, query: CustomerQuery): void => {
      const nextCustomers = demoCustomers.filter((customer) => customer.id !== id)
      const { items, total, page } = applyDemoQuery(nextCustomers, query)

      lastQueryRef.current = { ...query, page }
      setDemoCustomers(nextCustomers)
      setTotalCustomers(total)
      dispatch({
        type: SET_CUSTOMERS,
        payload: items,
      })
    },
    [demoCustomers, dispatch],
  )

  const fetchCustomers = useCallback(
    async (options: FetchCustomersOptions = {}): Promise<Customer[]> => {
      const query = normalizeQuery(options, lastQueryRef.current)
      lastQueryRef.current = query
      setLoading(true)

      try {
        const params = new URLSearchParams({
          _page: String(query.page),
          _limit: String(query.limit),
          _sort: query.sortField,
          _order: query.sortDirection,
        })

        if (query.searchQuery.trim()) {
          params.set('q', query.searchQuery.trim())
        }

        const response = await fetch(`${CUSTOMERS_API_BASE_URL}?${params.toString()}`)

        if (!response.ok) {
          throw new Error(`Request failed: ${response.status}`)
        }

        const data: Customer[] = await response.json()
        const totalCountHeader = response.headers.get('X-Total-Count')
        const parsedTotalCount = totalCountHeader ? Number(totalCountHeader) : Number.NaN

        setTotalCustomers(Number.isNaN(parsedTotalCount) ? data.length : parsedTotalCount)
        dispatch({ type: SET_CUSTOMERS, payload: data })
        setError(null)
        setIsDemoMode(false)
        return data
      } catch {
        const fallbackResult = applyDemoQuery(demoCustomers, query)

        lastQueryRef.current = { ...query, page: fallbackResult.page }
        setTotalCustomers(fallbackResult.total)
        dispatch({ type: SET_CUSTOMERS, payload: fallbackResult.items })
        setError(FALLBACK_MESSAGE)
        setIsDemoMode(true)
        return fallbackResult.items
      } finally {
        setLoading(false)
      }
    },
    [demoCustomers, dispatch],
  )

  const addCustomer = useCallback(
    async (formData: CustomerFormData): Promise<void> => {
      setLoading(true)
      const query = lastQueryRef.current

      if (isDemoMode) {
        applyLocalAdd(formData, query)
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

        await fetchCustomers(query)
      } catch {
        setIsDemoMode(true)
        applyLocalAdd(formData, query)
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
      const query = lastQueryRef.current

      if (isDemoMode) {
        applyLocalUpdate(id, customer, query)
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

        await fetchCustomers(query)
      } catch {
        setIsDemoMode(true)
        applyLocalUpdate(id, customer, query)
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
      const query = lastQueryRef.current

      if (isDemoMode) {
        applyLocalDelete(id, query)
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

        await fetchCustomers(query)
      } catch {
        setIsDemoMode(true)
        applyLocalDelete(id, query)
        setError(DEMO_MODE_MESSAGE)
      } finally {
        setLoading(false)
      }
    },
    [applyLocalDelete, fetchCustomers, isDemoMode],
  )

  useEffect(() => {
    if (hasLoadedOnMountRef.current) {
      return
    }

    hasLoadedOnMountRef.current = true
    void fetchCustomers(DEFAULT_QUERY)
  }, [fetchCustomers])

  return {
    customers,
    totalCustomers,
    loading,
    error,
    isDemoMode,
    fetchCustomers,
    addCustomer,
    updateCustomer,
    deleteCustomer,
  }
}