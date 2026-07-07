import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, test, vi } from 'vitest'
import CustomerList from './CustomerList'
import type { Customer } from '../types/customer'

describe('CustomerList', () => {
  test('Renders customer names', () => {
    const customers: Customer[] = [
      {
        id: 1,
        name: 'Alice Johnson',
        email: 'alice@example.com',
        city: 'New York',
        phone: '111-111-1111',
        address: '100 Main St',
        state: 'NY',
        zip: '10001',
      },
      {
        id: 2,
        name: 'Bob Smith',
        email: 'bob@example.com',
        city: 'Chicago',
        phone: '222-222-2222',
        address: '200 Oak Ave',
        state: 'IL',
        zip: '60601',
      },
      {
        id: 3,
        name: 'Charlie Davis',
        email: 'charlie@example.com',
        city: 'Seattle',
        phone: '333-333-3333',
        address: '300 Pine Rd',
        state: 'WA',
        zip: '98101',
      },
    ]

    render(
      <MemoryRouter>
        <CustomerList customers={customers} onDelete={() => {}} deletingCustomerId={null} />
      </MemoryRouter>,
    )

    customers.forEach((customer) => {
      expect(screen.getByText(customer.name)).toBeInTheDocument()
    })
  })

  test('Renders empty state when no customers are provided', () => {
    render(
      <MemoryRouter>
        <CustomerList customers={[]} onDelete={() => {}} deletingCustomerId={null} />
      </MemoryRouter>,
    )

    expect(screen.getByText('No customers found.')).toBeInTheDocument()
  })

  test('Delete callback', () => {
    const customers: Customer[] = [
      {
        id: 42,
        name: 'Dana Lee',
        email: 'dana@example.com',
        city: 'Austin',
        phone: '444-444-4444',
        address: '400 Cedar Ln',
        state: 'TX',
        zip: '73301',
      },
    ]
    const onDelete = vi.fn()

    render(
      <MemoryRouter>
        <CustomerList customers={customers} onDelete={onDelete} deletingCustomerId={null} />
      </MemoryRouter>,
    )

    screen.getByRole('button', { name: 'Delete' }).click()

    expect(onDelete).toHaveBeenCalledTimes(1)
    expect(onDelete).toHaveBeenCalledWith(42)
  })

  test('Edit links', () => {
    const customers: Customer[] = [
      {
        id: 1,
        name: 'Alice Johnson',
        email: 'alice@example.com',
        city: 'New York',
        phone: '111-111-1111',
        address: '100 Main St',
        state: 'NY',
        zip: '10001',
      },
      {
        id: 2,
        name: 'Bob Smith',
        email: 'bob@example.com',
        city: 'Chicago',
        phone: '222-222-2222',
        address: '200 Oak Ave',
        state: 'IL',
        zip: '60601',
      },
    ]

    render(
      <MemoryRouter>
        <CustomerList customers={customers} onDelete={() => {}} deletingCustomerId={null} />
      </MemoryRouter>,
    )

    const editLinks = screen.getAllByRole('link', { name: 'Edit' })

    expect(editLinks).toHaveLength(customers.length)
    editLinks.forEach((link, index) => {
      expect(link).toHaveAttribute('href', `/edit/${customers[index].id}`)
    })
  })
})
