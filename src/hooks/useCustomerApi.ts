import { useCallback, useEffect, useRef, useState } from 'react'
import { SET_CUSTOMERS } from '../context/customerReducer'
import { useCustomerContext } from '../context/useCustomerContext'
import sampleCustomers from '../data/sampleCustomers'
import type { Customer, CustomerFormData } from '../types/customer'

// API and fallback messaging constants.
const CUSTOMERS_API_BASE_URL = '/api/customers'
const FALLBACK_MESSAGE = 'API is unavailable. Showing sample customer data.'
const DEMO_MODE_MESSAGE =
  'API is unavailable. Demo mode enabled with local customer changes.'
const DEFAULT_PAGE = 1
const DEFAULT_LIMIT = 10

// Allowed server-side sort options.
type CustomerSortField = 'name' | 'email' | 'city' | 'state'
type CustomerSortDirection = 'asc' | 'desc'

// Optional query parameters accepted by fetchCustomers.
type FetchCustomersOptions = {
  page?: number
  limit?: number
  searchQuery?: string
  sortField?: CustomerSortField
  sortDirection?: CustomerSortDirection
}

// Fully normalized query shape used internally.
type CustomerQuery = {
  page: number
  limit: number
  searchQuery: string
  sortField: CustomerSortField
  sortDirection: CustomerSortDirection
}

// Default query used for first load and reset scenarios.
const DEFAULT_QUERY: CustomerQuery = {
  page: DEFAULT_PAGE,
  limit: DEFAULT_LIMIT,
  searchQuery: '',
  sortField: 'name',
  sortDirection: 'asc',
}

// Returns a slice of records for the requested page + page size.
function getPaginatedCustomers(
  allCustomers: Customer[],
  page: number,
  limit: number,
): Customer[] {
  const startIndex = (page - 1) * limit
  return allCustomers.slice(startIndex, startIndex + limit)
}

// Merges partial query options with current query state.
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

// Applies search, sort, and pagination locally for demo-mode fallback.
function applyDemoQuery(
  allCustomers: Customer[],
  query: CustomerQuery,
): { items: Customer[]; total: number; page: number } {
  // Split free-text query into terms that must all match.
  const searchTerms = query.searchQuery
    .trim()
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)

  // Filter by searchable fields (name/email/city).
  const filteredCustomers =
    searchTerms.length === 0
      ? allCustomers
      : allCustomers.filter((customer) => {
          const searchableContent = `${customer.name} ${customer.email} ${customer.city}`.toLowerCase()

          return searchTerms.every((searchTerm) => searchableContent.includes(searchTerm))
        })

  // Sort according to selected column and direction.
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

  // Compute total rows and clamp page to valid range.
  const total = sortedCustomers.length
  const totalPages = Math.max(1, Math.ceil(total / query.limit))
  const page = Math.min(query.page, totalPages)

  // Return paginated items and metadata.
  return {
    items: getPaginatedCustomers(sortedCustomers, page, query.limit),
    total,
    page,
  }
}

// Custom hook that encapsulates customer API CRUD + demo fallback mode.
export function useCustomerApi() {
  // Read current customer state and reducer dispatch from context.
  const {
    state: { customers },
    dispatch,
  } = useCustomerContext()

  // Hook-level request and fallback state.
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isDemoMode, setIsDemoMode] = useState(false)
  const [totalCustomers, setTotalCustomers] = useState(0)
  const [demoCustomers, setDemoCustomers] = useState<Customer[]>(sampleCustomers)

  // Refs for preserving query state and avoiding duplicate initial fetch.
  const lastQueryRef = useRef<CustomerQuery>(DEFAULT_QUERY)
  const hasLoadedOnMountRef = useRef(false)

  // Generates next id for local demo data mutations.
  const getNextCustomerId = useCallback((existingCustomers: Customer[]): number => {
    const highestCustomerId = existingCustomers.reduce(
      (currentHighest, customer) => Math.max(currentHighest, customer.id),
      0,
    )

    return highestCustomerId + 1
  }, [])

  // Demo-mode add: mutate local fallback data and sync visible page.
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

  // Demo-mode update: replace matching customer and re-apply current query.
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

  // Demo-mode delete: remove customer and re-apply current query.
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

  // Loads customer list from server with pagination/search/sort params.
  // Falls back to demo data when API is unavailable.
  const fetchCustomers = useCallback(
    async (options: FetchCustomersOptions = {}): Promise<Customer[]> => {
      const query = normalizeQuery(options, lastQueryRef.current)
      lastQueryRef.current = query
      setLoading(true)

      try {
        // Build JSON Server query params.
        const params = new URLSearchParams({
          _page: String(query.page),
          _limit: String(query.limit),
          _sort: query.sortField,
          _order: query.sortDirection,
        })

        // Optional free-text server search.
        if (query.searchQuery.trim()) {
          params.set('q', query.searchQuery.trim())
        }

        const response = await fetch(`${CUSTOMERS_API_BASE_URL}?${params.toString()}`)

        if (!response.ok) {
          throw new Error(`Request failed: ${response.status}`)
        }

        // Read rows and total count metadata from response.
        const data: Customer[] = await response.json()
        const totalCountHeader = response.headers.get('X-Total-Count')
        const parsedTotalCount = totalCountHeader ? Number(totalCountHeader) : Number.NaN

        setTotalCustomers(Number.isNaN(parsedTotalCount) ? data.length : parsedTotalCount)
        dispatch({ type: SET_CUSTOMERS, payload: data })
        setError(null)
        setIsDemoMode(false)
        return data
      } catch {
        // Fallback path: compute results locally from demo dataset.
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

  // Creates customer via API, or locally when in demo mode / API failure.
  const addCustomer = useCallback(
    async (formData: CustomerFormData): Promise<void> => {
      setLoading(true)
      const query = lastQueryRef.current

      // Fast path: already in demo mode.
      if (isDemoMode) {
        applyLocalAdd(formData, query)
        setError(DEMO_MODE_MESSAGE)
        setLoading(false)
        return
      }

      setError(null)

      try {
        // Server create request.
        const response = await fetch(CUSTOMERS_API_BASE_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        })

        if (!response.ok) {
          throw new Error(`Request failed: ${response.status}`)
        }

        // Refresh visible list using current query.
        await fetchCustomers(query)
      } catch {
        // API failed: switch to demo mode and apply locally.
        setIsDemoMode(true)
        applyLocalAdd(formData, query)
        setError(DEMO_MODE_MESSAGE)
      } finally {
        setLoading(false)
      }
    },
    [applyLocalAdd, fetchCustomers, isDemoMode],
  )

  // Updates customer via API, or locally in demo mode / API failure.
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
        // Server update request.
        const response = await fetch(`${CUSTOMERS_API_BASE_URL}/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(customer),
        })

        if (!response.ok) {
          throw new Error(`Request failed: ${response.status}`)
        }

        // Refresh visible list using current query.
        await fetchCustomers(query)
      } catch {
        // API failed: switch to demo mode and apply locally.
        setIsDemoMode(true)
        applyLocalUpdate(id, customer, query)
        setError(DEMO_MODE_MESSAGE)
      } finally {
        setLoading(false)
      }
    },
    [applyLocalUpdate, fetchCustomers, isDemoMode],
  )

  // Deletes customer via API, or locally in demo mode / API failure.
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
        // Server delete request.
        const response = await fetch(`${CUSTOMERS_API_BASE_URL}/${id}`, {
          method: 'DELETE',
        })

        if (!response.ok) {
          throw new Error(`Request failed: ${response.status}`)
        }

        // Refresh visible list using current query.
        await fetchCustomers(query)
      } catch {
        // API failed: switch to demo mode and apply locally.
        setIsDemoMode(true)
        applyLocalDelete(id, query)
        setError(DEMO_MODE_MESSAGE)
      } finally {
        setLoading(false)
      }
    },
    [applyLocalDelete, fetchCustomers, isDemoMode],
  )

  // Loads a single customer by id for detail/edit views.
  // Falls back to demo data when API is unavailable.
  const getCustomerById = useCallback(
    async (id: number): Promise<Customer | null> => {
      setLoading(true)

      if (isDemoMode) {
        const localCustomer = demoCustomers.find((customer) => customer.id === id) ?? null
        setError(localCustomer ? DEMO_MODE_MESSAGE : null)
        setLoading(false)
        return localCustomer
      }

      setError(null)

      try {
        const response = await fetch(`${CUSTOMERS_API_BASE_URL}/${id}`)

        if (response.status === 404) {
          return null
        }

        if (!response.ok) {
          throw new Error(`Request failed: ${response.status}`)
        }

        const customer: Customer = await response.json()
        setError(null)
        setIsDemoMode(false)
        return customer
      } catch {
        const localCustomer = demoCustomers.find((customer) => customer.id === id) ?? null

        setError(FALLBACK_MESSAGE)
        setIsDemoMode(true)
        return localCustomer
      } finally {
        setLoading(false)
      }
    },
    [demoCustomers, isDemoMode],
  )

  // Perform one initial load when the hook is first mounted.
  useEffect(() => {
    if (hasLoadedOnMountRef.current) {
      return
    }

    hasLoadedOnMountRef.current = true
    void fetchCustomers(DEFAULT_QUERY)
  }, [fetchCustomers])

  // Public API consumed by pages/components.
  return {
    customers,
    totalCustomers,
    loading,
    error,
    isDemoMode,
    fetchCustomers,
    getCustomerById,
    addCustomer,
    updateCustomer,
    deleteCustomer,
  }
}