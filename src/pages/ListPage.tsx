import { useEffect, useState } from 'react'
import ApiStatus from '../components/ApiStatus'
import CustomerList from '../components/CustomerList'
import { useCustomerApi } from '../hooks/useCustomerApi'

type SortField = 'name' | 'email' | 'city' | 'state'
type SortDirection = 'asc' | 'desc'

const SORT_STORAGE_KEY = 'customer-list-sort'
const DEFAULT_SORT: { field: SortField; direction: SortDirection } = {
  field: 'name',
  direction: 'asc',
}

function isSortField(value: unknown): value is SortField {
  return value === 'name' || value === 'email' || value === 'city' || value === 'state'
}

function isSortDirection(value: unknown): value is SortDirection {
  return value === 'asc' || value === 'desc'
}

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

function ListPage() {
  const { customers, totalCustomers, loading, error, deleteCustomer, fetchCustomers } =
    useCustomerApi()
  const [deletingCustomerId, setDeletingCustomerId] = useState<number | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [sortField, setSortField] = useState<SortField>(() => getInitialSort().field)
  const [sortDirection, setSortDirection] = useState<SortDirection>(
    () => getInitialSort().direction,
  )
  const [currentPage, setCurrentPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(10)

  const totalPages = Math.max(1, Math.ceil(totalCustomers / rowsPerPage))

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

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages)
    }
  }, [currentPage, totalPages])

  useEffect(() => {
    window.localStorage.setItem(
      SORT_STORAGE_KEY,
      JSON.stringify({ field: sortField, direction: sortDirection }),
    )
  }, [sortDirection, sortField])

  function handleSortChange(field: SortField) {
    setCurrentPage(1)

    if (field === sortField) {
      setSortDirection((currentDirection) => (currentDirection === 'asc' ? 'desc' : 'asc'))
      return
    }

    setSortField(field)
    setSortDirection('asc')
  }

  function handleSearchChange(value: string) {
    setSearchQuery(value)
    setCurrentPage(1)
  }

  function handleRowsPerPageChange(value: string) {
    const nextRowsPerPage = Number(value)

    if (![10, 25, 50].includes(nextRowsPerPage)) {
      return
    }

    setRowsPerPage(nextRowsPerPage)
    setCurrentPage(1)
  }

  async function handleDeleteCustomer(id: number) {
    const isConfirmed = window.confirm('Delete this customer?')

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

  return (
    <section>
      <h2 className="page-title">Customers</h2>
      <ApiStatus loading={loading} error={error} loadingMessage="Loading customers..." />
      {!loading ? (
        <>
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
