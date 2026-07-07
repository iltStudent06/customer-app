import { useNavigate } from 'react-router-dom'
import ApiStatus from '../components/ApiStatus'
import CustomerForm from '../components/CustomerForm'
import { useCustomerApi } from '../hooks/useCustomerApi'
import type { CustomerFormData } from '../types/customer'

function AddPage() {
  const navigate = useNavigate()
  const { addCustomer, loading, error } = useCustomerApi()

  async function handleAddCustomer(formData: CustomerFormData) {
    try {
      await addCustomer(formData)
      navigate('/')
    } catch {
      return
    }
  }

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
