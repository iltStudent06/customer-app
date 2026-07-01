import type { Customer } from '../types/customer'
import CustomerRow from './CustomerRow'

interface CustomerListProps {
  customers: Customer[]
  onDelete: (id: number) => void
  deletingCustomerId: number | null
}

function CustomerList({
  customers,
  onDelete,
  deletingCustomerId,
}: CustomerListProps) {
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
          <CustomerRow
            key={customer.id}
            customer={customer}
            onDelete={onDelete}
            isDeleting={deletingCustomerId === customer.id}
          />
        ))}
      </tbody>
    </table>
  )
}

export default CustomerList
