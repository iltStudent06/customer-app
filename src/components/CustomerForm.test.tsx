import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, test, vi } from 'vitest'
import CustomerForm from './CustomerForm'

describe('CustomerForm', () => {
  test('Validation errors', async () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined)
    const user = userEvent.setup()

    render(
      <CustomerForm
        mode="add"
        onSubmit={onSubmit}
        onCancel={() => {}}
      />,
    )

    await user.click(screen.getByRole('button', { name: 'Add Customer' }))

    expect(await screen.findByText('Name is required.')).toBeInTheDocument()
    expect(await screen.findByText('Email is required.')).toBeInTheDocument()
    expect(await screen.findByText('Phone is required.')).toBeInTheDocument()
    expect(onSubmit).not.toHaveBeenCalled()
  })

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

    const formData = {
      name: 'Jane Doe',
      email: 'jane.doe@example.com',
      phone: '555-123-4567',
      address: '123 Main St',
      city: 'Denver',
      state: 'CO',
      zip: '80202',
    }

    await user.type(screen.getByLabelText('Name'), formData.name)
    await user.type(screen.getByLabelText('Email'), formData.email)
    await user.type(screen.getByLabelText('Phone'), formData.phone)
    await user.type(screen.getByLabelText('Address'), formData.address)
    await user.type(screen.getByLabelText('City'), formData.city)
    await user.type(screen.getByLabelText('State'), formData.state)
    await user.type(screen.getByLabelText('ZIP'), formData.zip)

    await user.click(screen.getByRole('button', { name: 'Add Customer' }))

    expect(onSubmit).toHaveBeenCalledTimes(1)
    expect(onSubmit).toHaveBeenCalledWith(formData)
  })

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
