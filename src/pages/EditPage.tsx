import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import ApiStatus from '../components/ApiStatus'
import CustomerForm from '../components/CustomerForm'
import { useCustomerApi } from '../hooks/useCustomerApi'
import type { Customer, CustomerFormData } from '../types/customer'

// Page component for editing an existing customer record.
function EditPage() {
  // Router helpers for navigation and route parameter access.
  const navigate = useNavigate()
  const { id } = useParams()

  // API hook values for loading current customers and submitting updates.
  const { loading, error, updateCustomer, getCustomerById } = useCustomerApi()

  // Parse and validate route id.
  const customerId = Number(id)
  const hasInvalidCustomerId = !id || Number.isNaN(customerId)

  // Holds the record fetched specifically for this edit route.
  const [customer, setCustomer] = useState<Customer | null>(null)

  // Load the customer by id when route parameter changes.
  useEffect(() => {
    if (hasInvalidCustomerId) {
      setCustomer(null)
      return
    }

    let isMounted = true

    async function loadCustomer() {
      const fetchedCustomer = await getCustomerById(customerId)

      if (!isMounted) {
        return
      }

      setCustomer(fetchedCustomer)
    }

    void loadCustomer()

    return () => {
      isMounted = false
    }
  }, [customerId, getCustomerById, hasInvalidCustomerId])

  // Handles form submit for edit mode and redirects to list on success.
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

  // Prefer a specific invalid-id message over API-level errors.
  const displayError = hasInvalidCustomerId ? 'Invalid customer ID.' : error

  // Render page title, status messaging, not-found fallback, and edit form.
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
