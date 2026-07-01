import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getCustomerById, updateCustomer } from '../api/customers'
import CustomerForm from '../components/CustomerForm'
import type { Customer, CustomerFormData } from '../types/customer'

function EditPage() {
  const navigate = useNavigate()
  const { id } = useParams()
  const [customer, setCustomer] = useState<Customer | undefined>(undefined)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    async function loadCustomer() {
      const customerId = Number(id)

      if (!id || Number.isNaN(customerId)) {
        setErrorMessage('Invalid customer ID.')
        setIsLoading(false)
        return
      }

      try {
        setErrorMessage('')
        const fetchedCustomer = await getCustomerById(customerId)
        setCustomer(fetchedCustomer)
      } catch {
        setErrorMessage(`Unable to load customer with ID: ${id}`)
      } finally {
        setIsLoading(false)
      }
    }

    loadCustomer()
  }, [id])

  async function handleEditCustomer(formData: CustomerFormData) {
    const customerId = Number(id)

    if (!id || Number.isNaN(customerId)) {
      setErrorMessage('Invalid customer ID.')
      return
    }

    try {
      setIsSubmitting(true)
      setErrorMessage('')
      await updateCustomer(customerId, formData)
      navigate('/')
    } catch {
      setErrorMessage('Unable to update customer. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section>
      <h2 className="page-title">Edit Customer</h2>
      {isLoading ? <p>Loading customer...</p> : null}
      {!isLoading && errorMessage ? <p>{errorMessage}</p> : null}
      {!isLoading && customer ? (
        <CustomerForm
          key={customer.id}
          mode="edit"
          initialCustomer={customer}
          onSubmit={handleEditCustomer}
          isSubmitting={isSubmitting}
        />
      ) : null}
    </section>
  )
}

export default EditPage
