import { useState, type ChangeEvent, type FormEvent } from 'react'
import type { Customer, CustomerFormData } from '../types/customer'

interface CustomerFormProps {
  mode: 'add' | 'edit'
  initialCustomer?: Customer
  onSubmit: (formData: CustomerFormData) => Promise<void>
  isSubmitting?: boolean
}

const EMPTY_FORM_DATA: CustomerFormData = {
  name: '',
  email: '',
  phone: '',
  address: '',
  city: '',
  state: '',
  zip: '',
}

function getInitialFormData(initialCustomer?: Customer): CustomerFormData {
  return {
    name: initialCustomer?.name ?? '',
    email: initialCustomer?.email ?? '',
    phone: initialCustomer?.phone ?? '',
    address: initialCustomer?.address ?? '',
    city: initialCustomer?.city ?? '',
    state: initialCustomer?.state ?? '',
    zip: initialCustomer?.zip ?? '',
  }
}

function CustomerForm({
  mode,
  initialCustomer,
  onSubmit,
  isSubmitting = false,
}: CustomerFormProps) {
  const [formData, setFormData] = useState<CustomerFormData>(() =>
    initialCustomer ? getInitialFormData(initialCustomer) : EMPTY_FORM_DATA,
  )

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    await onSubmit(formData)
  }

  function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
    const fieldName = event.target.name as keyof CustomerFormData
    const fieldValue = event.target.value

    setFormData((currentData) => ({
      ...currentData,
      [fieldName]: fieldValue,
    }))
  }

  return (
    <form className="customer-form" onSubmit={handleSubmit}>
      <div className="form-grid">
        <label>
          Name
          <input
            value={formData.name}
            onChange={handleInputChange}
            name="name"
            required
            disabled={isSubmitting}
          />
        </label>
        <label>
          Email
          <input
            value={formData.email}
            onChange={handleInputChange}
            name="email"
            type="email"
            required
            disabled={isSubmitting}
          />
        </label>
        <label>
          Phone
          <input
            value={formData.phone}
            onChange={handleInputChange}
            name="phone"
            required
            disabled={isSubmitting}
          />
        </label>
        <label>
          Address
          <input
            value={formData.address}
            onChange={handleInputChange}
            name="address"
            required
            disabled={isSubmitting}
          />
        </label>
        <label>
          City
          <input
            value={formData.city}
            onChange={handleInputChange}
            name="city"
            required
            disabled={isSubmitting}
          />
        </label>
        <label>
          State
          <input
            value={formData.state}
            onChange={handleInputChange}
            maxLength={2}
            name="state"
            required
            disabled={isSubmitting}
          />
        </label>
        <label>
          ZIP
          <input
            value={formData.zip}
            onChange={handleInputChange}
            name="zip"
            required
            disabled={isSubmitting}
          />
        </label>
      </div>
      <button type="submit" className="form-button" disabled={isSubmitting}>
        {isSubmitting ? 'Saving...' : mode === 'add' ? 'Add Customer' : 'Save Changes'}
      </button>
    </form>
  )
}

export default CustomerForm
