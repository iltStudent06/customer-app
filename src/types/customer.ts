export interface Customer {
    id: number; // Unique identifier (assigned by JSON Server automatically)
    name: string; // Customer’s full name
    email: string; // Email address
    phone: string; // Phone number
    address: string; // Street address
    city: string; // City
    state: string; // State abbreviation
    zip: string; // ZIP code
}

export type CustomerFormData = Omit<Customer, "id">;