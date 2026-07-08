import type { Customer } from '../types/customer'
import { Link } from 'react-router-dom'

type SortField = 'name' | 'email' | 'city' | 'state'
type SortDirection = 'asc' | 'desc'

type Props = {
  customers: Customer[]
  onDelete: (id: number) => void
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
  function getSortClassName(field: SortField, direction: SortDirection): string {
    return field === sortField && sortDirection === direction
      ? 'customer-table-sort-indicator customer-table-sort-indicator-active'
      : 'customer-table-sort-indicator'
  }

  function getAriaSortValue(field: SortField): 'ascending' | 'descending' | 'none' {
    if (field !== sortField) {
      return 'none'
    }

    return sortDirection === 'asc' ? 'ascending' : 'descending'
  }

  if (customers.length === 0) {
    return <p>No customers found.</p>
  }

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
          <th aria-sort={getAriaSortValue('state')}>
            <button
              type="button"
              className="customer-table-sort-button"
              onClick={() => onSortChange('state')}
            >
              <span>State</span>
              <span className="customer-table-sort-indicators" aria-hidden="true">
                <span className={getSortClassName('state', 'asc')}>▲</span>
                <span className={getSortClassName('state', 'desc')}>▼</span>
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
            <td>{customer.state}</td>
            <td>{customer.phone}</td>
            <td className="row-actions">
              <Link className="row-action-button row-action-edit" to={`/edit/${customer.id}`}>
                Edit
              </Link>
              <button
                type="button"
                className="row-action-button row-action-delete"
                onClick={() => onDelete(customer.id)}
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
