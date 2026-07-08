import { useNavigate } from 'react-router-dom'
import ApiStatus from '../components/ApiStatus'
import CustomerForm from '../components/CustomerForm'
import { useCustomerApi } from '../hooks/useCustomerApi'
import type { CustomerFormData } from '../types/customer'

// Page component for creating a new customer record.
function AddPage() {
  // Router navigation helper for redirecting after actions.
  const navigate = useNavigate()

  // API hook values for create operation and request status display.
  const { addCustomer, loading, error } = useCustomerApi()

  // Handles form submission: create customer, then return to list page.
  async function handleAddCustomer(formData: CustomerFormData) {
    try {
      await addCustomer(formData)
      navigate('/')
    } catch {
      return
    }
  }

  // Render page title, API status messaging, and add-mode customer form.
  return (
    <section>
      <h2 className="page-title">Add Customer</h2>
      <ApiStatus loading={loading} error={error} loadingMessage="Loading customer data..." />
      <CustomerForm
        mode="add"
        onSubmit={handleAddCustomer}
        onCancel={() => navigate('/')}
        isSubmitting={loading}
      />
    </section>
  )
}

export default AddPage
