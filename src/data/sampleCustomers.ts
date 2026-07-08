import type { Customer } from '../types/customer'

const sampleCustomers: Customer[] = [
  {
    id: 101,
    name: 'Alex Johnson',
    email: 'alex.johnson@example.com',
    phone: '(555) 010-1001',
    address: '1200 Market Street',
    city: 'San Francisco',
    state: 'CA',
    zip: '94103',
  },
  {
    id: 102,
    name: 'Priya Patel',
    email: 'priya.patel@example.com',
    phone: '(555) 010-1002',
    address: '88 Lakeview Ave',
    city: 'Chicago',
    state: 'IL',
    zip: '60601',
  },
  {
    id: 103,
    name: 'Miguel Reyes',
    email: 'miguel.reyes@example.com',
    phone: '(555) 010-1003',
    address: '450 Pine Road',
    city: 'Austin',
    state: 'TX',
    zip: '73301',
  },
  {
    id: 104,
    name: 'Hannah Kim',
    email: 'hannah.kim@example.com',
    phone: '(555) 010-1004',
    address: '77 Riverview Blvd',
    city: 'Seattle',
    state: 'WA',
    zip: '98101',
  },
]

export default sampleCustomers