import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, test, vi } from 'vitest'
import CustomerForm from './CustomerForm'

// Test suite covering form validation, submission, and mode-specific behavior.
describe('CustomerForm', () => {
  // Verifies required-field validation appears when submitting an empty form.
  test('Validation errors', async () => {
    // Mock submit callback and user interaction helper.
    const onSubmit = vi.fn().mockResolvedValue(undefined)
    const user = userEvent.setup()

    // Render add-mode form with submit/cancel handlers.
    render(
      <CustomerForm
        mode="add"
        onSubmit={onSubmit}
        onCancel={() => {}}
      />,
    )

    // Trigger submit without entering values.
    await user.click(screen.getByRole('button', { name: 'Add Customer' }))

    // Expect required-field messages and no submit call.
    expect(await screen.findByText('Name is required.')).toBeInTheDocument()
    expect(await screen.findByText('Email is required.')).toBeInTheDocument()
    expect(await screen.findByText('Phone is required.')).toBeInTheDocument()
    expect(onSubmit).not.toHaveBeenCalled()
  })

  // Verifies valid input submits once with complete form payload.
  test('Successful submit', async () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined)
    const user = userEvent.setup()

    render(
      <CustomerForm
        mode="add"
        onSubmit={onSubmit}
        onCancel={() => {}}
      />,
    )

    // Representative valid data for all form fields.
    const formData = {
      name: 'Jane Doe',
      email: 'jane.doe@example.com',
      phone: '555-123-4567',
      address: '123 Main St',
      city: 'Denver',
      state: 'CO',
      zip: '80202',
    }

    // Fill out fields as a user would.
    await user.type(screen.getByLabelText('Name'), formData.name)
    await user.type(screen.getByLabelText('Email'), formData.email)
    await user.type(screen.getByLabelText('Phone'), formData.phone)
    await user.type(screen.getByLabelText('Address'), formData.address)
    await user.type(screen.getByLabelText('City'), formData.city)
    await user.type(screen.getByLabelText('State'), formData.state)
    await user.type(screen.getByLabelText('ZIP'), formData.zip)

    // Submit and assert payload forwarding.
    await user.click(screen.getByRole('button', { name: 'Add Customer' }))

    expect(onSubmit).toHaveBeenCalledTimes(1)
    expect(onSubmit).toHaveBeenCalledWith(formData)
  })

  // Verifies Name rule: minimum 2 characters.
  test('Name requires at least 2 characters', async () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined)
    const user = userEvent.setup()

    render(
      <CustomerForm
        mode="add"
        onSubmit={onSubmit}
        onCancel={() => {}}
      />,
    )

    await user.type(screen.getByLabelText('Name'), 'A')
    await user.type(screen.getByLabelText('Email'), 'valid@example.com')
    await user.type(screen.getByLabelText('Phone'), '555-123-4567')
    await user.click(screen.getByRole('button', { name: 'Add Customer' }))

    expect(await screen.findByText('Name must be at least 2 characters.')).toBeInTheDocument()
    expect(onSubmit).not.toHaveBeenCalled()
  })

  // Verifies Name rule: numeric characters are not allowed.
  test('Name cannot contain numbers', async () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined)
    const user = userEvent.setup()

    render(
      <CustomerForm
        mode="add"
        onSubmit={onSubmit}
        onCancel={() => {}}
      />,
    )

    await user.type(screen.getByLabelText('Name'), 'Jane2')
    await user.type(screen.getByLabelText('Email'), 'valid@example.com')
    await user.type(screen.getByLabelText('Phone'), '555-123-4567')
    await user.click(screen.getByRole('button', { name: 'Add Customer' }))

    expect(await screen.findByText('Name cannot contain numbers.')).toBeInTheDocument()
    expect(onSubmit).not.toHaveBeenCalled()
  })

  // Verifies Phone rule: only digits and dashes are allowed.
  test('Phone cannot contain letters', async () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined)
    const user = userEvent.setup()

    render(
      <CustomerForm
        mode="add"
        onSubmit={onSubmit}
        onCancel={() => {}}
      />,
    )

    await user.type(screen.getByLabelText('Name'), 'Jane Doe')
    await user.type(screen.getByLabelText('Email'), 'valid@example.com')
    await user.type(screen.getByLabelText('Phone'), '555-ABCD')
    await user.click(screen.getByRole('button', { name: 'Add Customer' }))

    expect(
      await screen.findByText('Phone can only contain numbers and dashes (-).'),
    ).toBeInTheDocument()
    expect(onSubmit).not.toHaveBeenCalled()
  })

  // Verifies clicking Cancel invokes the provided callback.
  test('Cancel button', async () => {
    const onCancel = vi.fn()
    const user = userEvent.setup()

    render(
      <CustomerForm
        mode="add"
        onSubmit={vi.fn().mockResolvedValue(undefined)}
        onCancel={onCancel}
      />,
    )

    await user.click(screen.getByRole('button', { name: 'Cancel' }))

    expect(onCancel).toHaveBeenCalledTimes(1)
  })

  // Verifies edit mode loads initial values into corresponding fields.
  test('Pre-fills in edit mode', () => {
    const initialData = {
      name: 'John Carter',
      email: 'john.carter@example.com',
      phone: '555-987-6543',
      address: '456 Elm St',
      city: 'Phoenix',
      state: 'AZ',
      zip: '85001',
    }

    render(
      <CustomerForm
        mode="edit"
        initialData={initialData}
        onSubmit={vi.fn().mockResolvedValue(undefined)}
        onCancel={() => {}}
      />,
    )

    expect(screen.getByLabelText('Name')).toHaveValue(initialData.name)
    expect(screen.getByLabelText('Email')).toHaveValue(initialData.email)
    expect(screen.getByLabelText('Phone')).toHaveValue(initialData.phone)
    expect(screen.getByLabelText('Address')).toHaveValue(initialData.address)
    expect(screen.getByLabelText('City')).toHaveValue(initialData.city)
    expect(screen.getByLabelText('State')).toHaveValue(initialData.state)
    expect(screen.getByLabelText('ZIP')).toHaveValue(initialData.zip)
  })
})
