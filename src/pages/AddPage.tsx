import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createCustomer } from '../api/customers'
import CustomerForm from '../components/CustomerForm'
import type { CustomerFormData } from '../types/customer'

function AddPage() {
  const navigate = useNavigate()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  async function handleAddCustomer(formData: CustomerFormData) {
    try {
      setIsSubmitting(true)
      setErrorMessage('')
      await createCustomer(formData)
      navigate('/')
    } catch {
      setErrorMessage('Unable to add customer. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section>
      <h2 className="page-title">Add Customer</h2>
      {errorMessage ? <p>{errorMessage}</p> : null}
      <CustomerForm
        mode="add"
        onSubmit={handleAddCustomer}
        isSubmitting={isSubmitting}
      />
    </section>
  )
}

export default AddPage
