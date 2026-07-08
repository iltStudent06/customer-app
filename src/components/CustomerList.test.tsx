import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, test, vi } from 'vitest'
import CustomerList from './CustomerList'
import type { Customer } from '../types/customer'

// Shared sort props required by CustomerList in these tests.
const defaultSortProps = {
  sortField: 'name' as const,
  sortDirection: 'asc' as const,
  onSortChange: () => {},
}

// Test suite for rendering and interaction behavior of the customer list table.
describe('CustomerList', () => {
  // Confirms all provided customer rows are rendered.
  test('Renders customer names', () => {
    // Representative sample rows for list rendering.
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

    // Render inside MemoryRouter because the component contains Link elements.
    render(
      <MemoryRouter>
        <CustomerList
          customers={customers}
          onDelete={() => {}}
          deletingCustomerId={null}
          {...defaultSortProps}
        />
      </MemoryRouter>,
    )

    // Assert each customer name appears in the table.
    customers.forEach((customer) => {
      expect(screen.getByText(customer.name)).toBeInTheDocument()
    })
  })

  // Confirms empty-state message is shown when there are no customers.
  test('Renders empty state when no customers are provided', () => {
    render(
      <MemoryRouter>
        <CustomerList
          customers={[]}
          onDelete={() => {}}
          deletingCustomerId={null}
          {...defaultSortProps}
        />
      </MemoryRouter>,
    )

    expect(screen.getByText('No customers found.')).toBeInTheDocument()
  })

  // Confirms delete action calls the callback with expected id and name.
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
    // Spy to verify delete callback invocation.
    const onDelete = vi.fn()

    render(
      <MemoryRouter>
        <CustomerList
          customers={customers}
          onDelete={onDelete}
          deletingCustomerId={null}
          {...defaultSortProps}
        />
      </MemoryRouter>,
    )

    // Trigger delete and verify callback arguments.
    screen.getByRole('button', { name: 'Delete' }).click()

    expect(onDelete).toHaveBeenCalledTimes(1)
    expect(onDelete).toHaveBeenCalledWith(42, 'Dana Lee')
  })

  // Confirms edit links render for each row and point to the correct route.
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
        <CustomerList
          customers={customers}
          onDelete={() => {}}
          deletingCustomerId={null}
          {...defaultSortProps}
        />
      </MemoryRouter>,
    )

    // Collect all Edit links and validate count and href values.
    const editLinks = screen.getAllByRole('link', { name: 'Edit' })

    expect(editLinks).toHaveLength(customers.length)
    editLinks.forEach((link, index) => {
      expect(link).toHaveAttribute('href', `/edit/${customers[index].id}`)
    })
  })
})
