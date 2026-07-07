import { useMemo } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import ApiStatus from '../components/ApiStatus'
import CustomerForm from '../components/CustomerForm'
import { useCustomerApi } from '../hooks/useCustomerApi'
import type { CustomerFormData } from '../types/customer'

function EditPage() {
  const navigate = useNavigate()
  const { id } = useParams()
  const { customers, loading, error, updateCustomer } = useCustomerApi()

  const customerId = Number(id)
  const hasInvalidCustomerId = !id || Number.isNaN(customerId)
  const customer = useMemo(
    () => customers.find((item) => item.id === customerId),
    [customerId, customers],
  )

  async function handleEditCustomer(formData: CustomerFormData) {
    if (hasInvalidCustomerId || !customer) {
      return
    }

    try {
      await updateCustomer(customerId, formData)
      navigate('/')
    } catch {
      return
    }
  }

  const displayError = hasInvalidCustomerId ? 'Invalid customer ID.' : error

  return (
    <section>
      <h2 className="page-title">Edit Customer</h2>
      <ApiStatus loading={loading} error={displayError} loadingMessage="Loading customer..." />
      {!loading && !displayError && !customer ? <p>Customer not found.</p> : null}
      {!loading && customer ? (
        <CustomerForm
          key={customer.id}
          mode="edit"
          initialData={customer}
          onSubmit={handleEditCustomer}
          onCancel={() => navigate('/')}
          isSubmitting={loading}
        />
      ) : null}
    </section>
  )
}

export default EditPage
