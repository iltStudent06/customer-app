import { useState, type ChangeEvent, type FormEvent } from 'react'
import type { CustomerFormData } from '../types/customer'

type Props = {
  mode: 'add' | 'edit'
  initialData?: CustomerFormData
  onSubmit: (formData: CustomerFormData) => Promise<void>
  onCancel: () => void
  isSubmitting?: boolean
}

const EMPTY_ERRORS: Record<keyof CustomerFormData, string> = {
  name: '',
  email: '',
  phone: '',
  address: '',
  city: '',
  state: '',
  zip: '',
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

function getInitialFormData(initialData?: CustomerFormData): CustomerFormData {
  return {
    name: initialData?.name ?? '',
    email: initialData?.email ?? '',
    phone: initialData?.phone ?? '',
    address: initialData?.address ?? '',
    city: initialData?.city ?? '',
    state: initialData?.state ?? '',
    zip: initialData?.zip ?? '',
  }
}

function CustomerForm({
  mode,
  initialData,
  onSubmit,
  onCancel,
  isSubmitting = false,
}: Props) {
  const [formData, setFormData] = useState<CustomerFormData>(() =>
    initialData ? getInitialFormData(initialData) : EMPTY_FORM_DATA,
  )
  const [errors, setErrors] = useState<Record<keyof CustomerFormData, string>>(EMPTY_ERRORS)

  function validate(data: CustomerFormData): Record<keyof CustomerFormData, string> {
    const validationErrors: Record<keyof CustomerFormData, string> = { ...EMPTY_ERRORS }

    if (!data.name.trim()) {
      validationErrors.name = 'Name is required.'
    }

    if (!data.email.trim()) {
      validationErrors.email = 'Email is required.'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      validationErrors.email = 'Enter a valid email address.'
    }

    if (!data.phone.trim()) {
      validationErrors.phone = 'Phone is required.'
    }

    return validationErrors
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const validationErrors = validate(formData)
    setErrors(validationErrors)

    const hasErrors = Object.values(validationErrors).some((message) => message !== '')

    if (hasErrors) {
      return
    }

    await onSubmit(formData)
  }

  function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
    const fieldName = event.target.name as keyof CustomerFormData
    const fieldValue = event.target.value

    setFormData((currentData) => ({
      ...currentData,
      [fieldName]: fieldValue,
    }))

    setErrors((currentErrors) =>
      currentErrors[fieldName]
        ? {
            ...currentErrors,
            [fieldName]: '',
          }
        : currentErrors,
    )
  }

  return (
    <form className="customer-form" onSubmit={handleSubmit} noValidate>
      <div className="form-grid">
        <label>
          Name
          <input
            value={formData.name}
            onChange={handleInputChange}
            name="name"
            className={errors.name ? 'form-input-invalid' : ''}
            aria-invalid={Boolean(errors.name)}
            disabled={isSubmitting}
          />
          {errors.name ? <span className="form-field-error">{errors.name}</span> : null}
        </label>
        <label>
          Email
          <input
            value={formData.email}
            onChange={handleInputChange}
            name="email"
            type="email"
            className={errors.email ? 'form-input-invalid' : ''}
            aria-invalid={Boolean(errors.email)}
            disabled={isSubmitting}
          />
          {errors.email ? <span className="form-field-error">{errors.email}</span> : null}
        </label>
        <label>
          Phone
          <input
            value={formData.phone}
            onChange={handleInputChange}
            name="phone"
            className={errors.phone ? 'form-input-invalid' : ''}
            aria-invalid={Boolean(errors.phone)}
            disabled={isSubmitting}
          />
          {errors.phone ? <span className="form-field-error">{errors.phone}</span> : null}
        </label>
        <label>
          Address
          <input
            value={formData.address}
            onChange={handleInputChange}
            name="address"
            disabled={isSubmitting}
          />
        </label>
        <label>
          City
          <input
            value={formData.city}
            onChange={handleInputChange}
            name="city"
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
            disabled={isSubmitting}
          />
        </label>
        <label>
          ZIP
          <input
            value={formData.zip}
            onChange={handleInputChange}
            name="zip"
            disabled={isSubmitting}
          />
        </label>
      </div>
      <button type="submit" className="form-button" disabled={isSubmitting}>
        {isSubmitting ? 'Saving...' : mode === 'edit' ? 'Update Customer' : 'Add Customer'}
      </button>
      <button
        type="button"
        className="form-button"
        onClick={onCancel}
        disabled={isSubmitting}
      >
        Cancel
      </button>
    </form>
  )
}

export default CustomerForm
