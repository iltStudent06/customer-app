import type { Customer } from '../types/customer'
import { Link } from 'react-router-dom'

// Sort options supported by the customer table headers.
type SortField = 'name' | 'email' | 'city'
type SortDirection = 'asc' | 'desc'

// Props expected by the customer list table.
// - customers: rows to render
// - onDelete: delete callback with id and customer name
// - deletingCustomerId: used to disable and relabel active delete button
// - sortField/sortDirection/onSortChange: sortable-column state and handler
type Props = {
  customers: Customer[]
  onDelete: (id: number, name: string) => void
  deletingCustomerId: number | null
  sortField: SortField
  sortDirection: SortDirection
  onSortChange: (field: SortField) => void
}

function CustomerList({
  customers,
  onDelete,
  deletingCustomerId,
  sortField,
  sortDirection,
  onSortChange,
}: Props) {
  // Returns CSS classes for sort arrows, highlighting the active direction.
  function getSortClassName(field: SortField, direction: SortDirection): string {
    return field === sortField && sortDirection === direction
      ? 'customer-table-sort-indicator customer-table-sort-indicator-active'
      : 'customer-table-sort-indicator'
  }

  // Returns aria-sort value for accessibility based on current sorted column.
  function getAriaSortValue(field: SortField): 'ascending' | 'descending' | 'none' {
    if (field !== sortField) {
      return 'none'
    }

    return sortDirection === 'asc' ? 'ascending' : 'descending'
  }

  // Empty state shown when there are no rows to display.
  if (customers.length === 0) {
    return <p>No customers found.</p>
  }

  // Render sortable table headers and row actions for edit/delete.
  return (
    <table className="customer-table">
      <thead>
        <tr>
          <th aria-sort={getAriaSortValue('name')}>
            <button
              type="button"
              className="customer-table-sort-button"
              onClick={() => onSortChange('name')}
            >
              <span>Name</span>
              <span className="customer-table-sort-indicators" aria-hidden="true">
                <span className={getSortClassName('name', 'asc')}>▲</span>
                <span className={getSortClassName('name', 'desc')}>▼</span>
              </span>
            </button>
          </th>
          <th aria-sort={getAriaSortValue('email')}>
            <button
              type="button"
              className="customer-table-sort-button"
              onClick={() => onSortChange('email')}
            >
              <span>Email</span>
              <span className="customer-table-sort-indicators" aria-hidden="true">
                <span className={getSortClassName('email', 'asc')}>▲</span>
                <span className={getSortClassName('email', 'desc')}>▼</span>
              </span>
            </button>
          </th>
          <th aria-sort={getAriaSortValue('city')}>
            <button
              type="button"
              className="customer-table-sort-button"
              onClick={() => onSortChange('city')}
            >
              <span>City</span>
              <span className="customer-table-sort-indicators" aria-hidden="true">
                <span className={getSortClassName('city', 'asc')}>▲</span>
                <span className={getSortClassName('city', 'desc')}>▼</span>
              </span>
            </button>
          </th>
          <th>Phone</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {customers.map((customer) => (
          <tr key={customer.id}>
            <td>{customer.name}</td>
            <td>{customer.email}</td>
            <td>{customer.city}</td>
            <td>{customer.phone}</td>
            <td className="row-actions">
              <Link className="row-action-button row-action-edit" to={`/edit/${customer.id}`}>
                Edit
              </Link>
              <button
                type="button"
                className="row-action-button row-action-delete"
                onClick={() => onDelete(customer.id, customer.name)}
                disabled={deletingCustomerId === customer.id}
              >
                {deletingCustomerId === customer.id ? 'Deleting...' : 'Delete'}
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export default CustomerList
