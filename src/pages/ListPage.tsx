import { useState } from 'react'
import ApiStatus from '../components/ApiStatus'
import CustomerList from '../components/CustomerList'
import { useCustomerApi } from '../hooks/useCustomerApi'

function ListPage() {
  const { customers, loading, error, deleteCustomer } = useCustomerApi()
  const [deletingCustomerId, setDeletingCustomerId] = useState<number | null>(null)

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
