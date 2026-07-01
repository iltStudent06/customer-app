import type { Customer } from '../types/customer'
import { Link } from 'react-router-dom'

interface CustomerRowProps {
  customer: Customer
  onDelete: (id: number) => void
  isDeleting: boolean
}

function CustomerRow({ customer, onDelete, isDeleting }: CustomerRowProps) {
  return (
    <tr>
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
          disabled={isDeleting}
        >
          {isDeleting ? 'Deleting...' : 'Delete'}
        </button>
      </td>
    </tr>
  )
}

export default CustomerRow
