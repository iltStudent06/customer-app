import { useEffect, useState } from 'react'
import ApiStatus from '../components/ApiStatus'
import CustomerList from '../components/CustomerList'
import { useCustomerApi } from '../hooks/useCustomerApi'

// Sort configuration types used by table headers and persisted preferences.
type SortField = 'name' | 'email' | 'city'
type SortDirection = 'asc' | 'desc'

// localStorage key and fallback sort preference.
const SORT_STORAGE_KEY = 'customer-list-sort'
const DEFAULT_SORT: { field: SortField; direction: SortDirection } = {
  field: 'name',
  direction: 'asc',
}

// Type guards for validating parsed sort preference data.
function isSortField(value: unknown): value is SortField {
  return value === 'name' || value === 'email' || value === 'city'
}

function isSortDirection(value: unknown): value is SortDirection {
  return value === 'asc' || value === 'desc'
}

// Reads initial sort preference from localStorage, with safe fallback.
function getInitialSort(): { field: SortField; direction: SortDirection } {
  try {
    const rawSort = window.localStorage.getItem(SORT_STORAGE_KEY)

    if (!rawSort) {
      return DEFAULT_SORT
    }

    const parsedSort: unknown = JSON.parse(rawSort)

    if (
      typeof parsedSort === 'object' &&
      parsedSort !== null &&
      'field' in parsedSort &&
      'direction' in parsedSort &&
      isSortField(parsedSort.field) &&
      isSortDirection(parsedSort.direction)
    ) {
      return {
        field: parsedSort.field,
        direction: parsedSort.direction,
      }
    }

    return DEFAULT_SORT
  } catch {
    return DEFAULT_SORT
  }
}

// Customer list page with server-side search/sort/pagination controls.
function ListPage() {
  // API hook values for list retrieval and delete action.
  const { customers, totalCustomers, loading, error, deleteCustomer, fetchCustomers } =
    useCustomerApi()

  // UI state for delete progress, filters, sorting, and pagination.
  const [deletingCustomerId, setDeletingCustomerId] = useState<number | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [sortField, setSortField] = useState<SortField>(() => getInitialSort().field)
  const [sortDirection, setSortDirection] = useState<SortDirection>(
    () => getInitialSort().direction,
  )
  const [currentPage, setCurrentPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(10)

  // Derived total page count based on server-reported total rows.
  const totalPages = Math.max(1, Math.ceil(totalCustomers / rowsPerPage))

  // Refetch customers whenever query controls change.
  useEffect(() => {
    void fetchCustomers({
      page: currentPage,
      limit: rowsPerPage,
      searchQuery,
      sortField,
      sortDirection,
    })
  }, [
    currentPage,
    fetchCustomers,
    rowsPerPage,
    searchQuery,
    sortDirection,
    sortField,
  ])

  // Keep current page in range if total pages shrink.
  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages)
    }
  }, [currentPage, totalPages])

  // Persist current sort selection to localStorage.
  useEffect(() => {
    window.localStorage.setItem(
      SORT_STORAGE_KEY,
      JSON.stringify({ field: sortField, direction: sortDirection }),
    )
  }, [sortDirection, sortField])

  // Updates sort selection and resets to first page.
  function handleSortChange(field: SortField) {
    setCurrentPage(1)

    if (field === sortField) {
      setSortDirection((currentDirection) => (currentDirection === 'asc' ? 'desc' : 'asc'))
      return
    }

    setSortField(field)
    setSortDirection('asc')
  }

  // Updates search text and resets to first page.
  function handleSearchChange(value: string) {
    setSearchQuery(value)
    setCurrentPage(1)
  }

  // Updates rows-per-page with allowed values and resets to first page.
  function handleRowsPerPageChange(value: string) {
    const nextRowsPerPage = Number(value)

    if (![10, 25, 50].includes(nextRowsPerPage)) {
      return
    }

    setRowsPerPage(nextRowsPerPage)
    setCurrentPage(1)
  }

  // Confirms delete action with customer name and invokes API delete.
  async function handleDeleteCustomer(id: number, customerName: string) {
    const isConfirmed = window.confirm(`Delete customer \"${customerName}\"?`)

    if (!isConfirmed) {
      return
    }

    try {
      setDeletingCustomerId(id)
      await deleteCustomer(id)
    } catch {
      return
    } finally {
      setDeletingCustomerId(null)
    }
  }

  // Render list page sections: status, search/filter, table, and pagination controls.
  return (
    <section>
      <h2 className="page-title">Customers</h2>
      <ApiStatus loading={loading} error={error} loadingMessage="Loading customers..." />
      <div className="customer-search-bar">
        <label htmlFor="customer-search" className="customer-search-label">
          Search customers
        </label>
        <div className="customer-search-input-row">
          <input
            id="customer-search"
            className="customer-search-input"
            type="search"
            value={searchQuery}
            onChange={(event) => handleSearchChange(event.target.value)}
            placeholder="Search by name, email, or city"
          />
          {searchQuery ? (
            <button
              type="button"
              className="customer-search-clear"
              onClick={() => handleSearchChange('')}
              aria-label="Clear search"
            >
              x
            </button>
          ) : null}
        </div>
        <p className="customer-search-count">
          Showing {customers.length} of {totalCustomers} customers
        </p>
      </div>
      {!loading ? (
        <>
          <CustomerList
            customers={customers}
            onDelete={handleDeleteCustomer}
            deletingCustomerId={deletingCustomerId}
            sortField={sortField}
            sortDirection={sortDirection}
            onSortChange={handleSortChange}
          />
          <div className="pagination-controls" aria-label="Pagination controls">
            <div className="pagination-page-size">
              <label htmlFor="rows-per-page">Rows per page</label>
              <select
                id="rows-per-page"
                value={rowsPerPage}
                onChange={(event) => handleRowsPerPageChange(event.target.value)}
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
              </select>
            </div>
            <div className="pagination-buttons">
              <button
                type="button"
                className="row-action-button"
                onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
                disabled={currentPage === 1}
              >
                Previous
              </button>
              <p className="pagination-page-number">Page {currentPage} of {totalPages}</p>
              <button
                type="button"
                className="row-action-button"
                onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
                disabled={currentPage >= totalPages}
              >
                Next
              </button>
            </div>
          </div>
        </>
      ) : null}
    </section>
  )
}

export default ListPage
