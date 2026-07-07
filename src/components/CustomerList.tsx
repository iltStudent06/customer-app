import type { Customer } from '../types/customer'
import { Link } from 'react-router-dom'

type Props = {
  customers: Customer[]
  onDelete: (id: number) => void
  deletingCustomerId: number | null
}

function CustomerList({ customers, onDelete, deletingCustomerId }: Props) {
  if (customers.length === 0) {
    return <p>No customers found.</p>
  }

  return (
    <table className="customer-table">
      <thead>
        <tr>
          <th>Name</th>
          <th>Email</th>
          <th>City</th>
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
