import { useState, type ChangeEvent, type FormEvent } from 'react'
import type { CustomerFormData } from '../types/customer'

// Component inputs for add/edit behavior and action callbacks.
type Props = {
  mode: 'add' | 'edit'
  initialData?: CustomerFormData
  onSubmit: (formData: CustomerFormData) => Promise<void>
  onCancel: () => void
  isSubmitting?: boolean
}

// Empty validation state used to initialize and reset field errors.
const EMPTY_ERRORS: Record<keyof CustomerFormData, string> = {
  name: '',
  email: '',
  phone: '',
  address: '',
  city: '',
  state: '',
  zip: '',
}

// Empty form model for add mode.
const EMPTY_FORM_DATA: CustomerFormData = {
  name: '',
  email: '',
  phone: '',
  address: '',
  city: '',
  state: '',
  zip: '',
}

// Produces initial form values, preferring provided edit data when available.
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

// Main form component used by both Add and Edit pages.
function CustomerForm({
  mode,
  initialData,
  onSubmit,
  onCancel,
  isSubmitting = false,
}: Props) {
  // Local form state and per-field validation messages.
  const [formData, setFormData] = useState<CustomerFormData>(() =>
    initialData ? getInitialFormData(initialData) : EMPTY_FORM_DATA,
  )
  const [errors, setErrors] = useState<Record<keyof CustomerFormData, string>>(EMPTY_ERRORS)

  // Validates required fields and format rules, returning keyed error messages.
  function validate(data: CustomerFormData): Record<keyof CustomerFormData, string> {
    const validationErrors: Record<keyof CustomerFormData, string> = { ...EMPTY_ERRORS }
    const trimmedName = data.name.trim()

    if (!trimmedName) {
      validationErrors.name = 'Name is required.'
    } else if (trimmedName.length < 2) {
      validationErrors.name = 'Name must be at least 2 characters.'
    } else if (/\d/.test(trimmedName)) {
      validationErrors.name = 'Name cannot contain numbers.'
    }

    if (!data.email.trim()) {
      validationErrors.email = 'Email is required.'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      validationErrors.email = 'Enter a valid email address.'
    }

    if (!data.phone.trim()) {
      validationErrors.phone = 'Phone is required.'
    } else if (!/^[0-9-]+$/.test(data.phone.trim())) {
      validationErrors.phone = 'Phone can only contain numbers and dashes (-).'
    }

    return validationErrors
  }

  // Handles form submit: validate first, then call parent submit handler if valid.
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

  // Updates field value and clears that field's error once user edits it.
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

  // Form layout with required and optional inputs, plus submit/cancel actions.
  return (
    <form className="customer-form" onSubmit={handleSubmit} noValidate>
      <div className="form-grid">
        <label htmlFor="name">
          <span className="form-label-text">
            Name <span aria-hidden="true">*</span>
          </span>
          <input
            id="name"
            aria-label="Name"
            value={formData.name}
            onChange={handleInputChange}
            name="name"
            className={errors.name ? 'form-input-invalid' : ''}
            aria-invalid={Boolean(errors.name)}
            disabled={isSubmitting}
          />
          {errors.name ? <span className="form-field-error">{errors.name}</span> : null}
        </label>
        <label htmlFor="email">
          <span className="form-label-text">
            Email <span aria-hidden="true">*</span>
          </span>
          <input
            id="email"
            aria-label="Email"
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
        <label htmlFor="phone">
          <span className="form-label-text">
            Phone <span aria-hidden="true">*</span>
          </span>
          <input
            id="phone"
            aria-label="Phone"
            value={formData.phone}
            onChange={handleInputChange}
            name="phone"
            className={errors.phone ? 'form-input-invalid' : ''}
            aria-invalid={Boolean(errors.phone)}
            disabled={isSubmitting}
          />
          {errors.phone ? <span className="form-field-error">{errors.phone}</span> : null}
        </label>
        <label htmlFor="address">
          Address
          <input
            id="address"
            value={formData.address}
            onChange={handleInputChange}
            name="address"
            disabled={isSubmitting}
          />
        </label>
        <label htmlFor="city">
          City
          <input
            id="city"
            value={formData.city}
            onChange={handleInputChange}
            name="city"
            disabled={isSubmitting}
          />
        </label>
        <label htmlFor="state">
          State
          <input
            id="state"
            value={formData.state}
            onChange={handleInputChange}
            maxLength={2}
            name="state"
            disabled={isSubmitting}
          />
        </label>
        <label htmlFor="zip">
          ZIP
          <input
            id="zip"
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
