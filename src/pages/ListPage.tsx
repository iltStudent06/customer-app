import { useEffect, useState } from 'react'
import { deleteCustomer, getCustomers } from '../api/customers'
import CustomerList from '../components/CustomerList'
import type { Customer } from '../types/customer'

function ListPage() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [deletingCustomerId, setDeletingCustomerId] = useState<number | null>(null)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    async function loadCustomers() {
      try {
        const fetchedCustomers = await getCustomers()
        setCustomers(fetchedCustomers)
      } catch {
        setErrorMessage('Unable to load customers. Is JSON Server running on port 3001?')
      } finally {
        setIsLoading(false)
      }
    }

    loadCustomers()
  }, [])

  async function handleDeleteCustomer(id: number) {
    const isConfirmed = window.confirm('Delete this customer?')

    if (!isConfirmed) {
      return
    }

    try {
      setDeletingCustomerId(id)
      setErrorMessage('')
      await deleteCustomer(id)
      setCustomers((currentCustomers) =>
        currentCustomers.filter((customer) => customer.id !== id),
      )
    } catch {
      setErrorMessage('Unable to delete customer. Please try again.')
    } finally {
      setDeletingCustomerId(null)
    }
  }

  return (
    <section>
      <h2 className="page-title">Customers</h2>
      {isLoading ? <p>Loading customers...</p> : null}
      {!isLoading && errorMessage ? <p>{errorMessage}</p> : null}
      {!isLoading ? (
        <CustomerList
          customers={customers}
          onDelete={handleDeleteCustomer}
          deletingCustomerId={deletingCustomerId}
        />
      ) : null}
    </section>
  )
}

export default ListPage
