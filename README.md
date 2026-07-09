# Customer Manager Application

A React + TypeScript customer management app with routing, validation, server-side list controls, and a demo fallback mode when the API is unavailable.

## Features

- Customer CRUD flows (add, edit, delete)
- Server-side list controls (JSON Server query params)
  - search by name/email/city
  - sorting by name/email/city
  - pagination with configurable page size (10, 25, 50)
- Delete confirmation including the customer name
- Form validation (required fields, name rules, phone format rules)
- Light/dark mode toggle
- Error boundary fallback UI with reset action
- API status messaging for loading/error states
- Demo fallback mode using local sample data when API requests fail

## Tech Stack

- React 19
- TypeScript
- Vite
- React Router
- JSON Server (local mock REST API)
- Vitest + Testing Library

## Getting Started

### 1) Install dependencies

```bash
npm install
```

### 2) Start the API

```bash
npm run api
```

If port `3001` is already in use:

```bash
npm run api:restart
```

### 3) Start the app

```bash
npm run dev
```

## Available Scripts

- `npm run dev` — run the Vite dev server
- `npm run api` — run JSON Server on `http://localhost:3001`
- `npm run api:restart` — free port `3001` and restart JSON Server
- `npm run build` — type-check and build production assets
- `npm run preview` — preview production build locally
- `npm run test` — run tests in watch mode
- `npm run test:run` — run tests once
- `npm run lint` — run ESLint
- `npm run deploy` — build and publish `dist` to GitHub Pages

## API Notes

The app uses `/api/customers` in the frontend and relies on the Vite dev proxy for local development.

Server-side list queries use JSON Server parameters:

- `_page`
- `_limit`
- `_sort`
- `_order`
- `q`

When the API is unavailable, the app switches to demo mode and serves customer data from `src/data/sampleCustomers.ts`, while keeping list search/sort/pagination behavior.

## Routing

- `/` — customer list
- `/add` — add customer
- `/edit/:id` — edit customer

The app uses `HashRouter` for GitHub Pages compatibility.

## GitHub Pages Deployment

Deploy with:

```bash
npm run deploy
```

Production URLs use hash routes:

- Home: `https://iltstudent06.github.io/customer-app/#/`
- Add: `https://iltstudent06.github.io/customer-app/#/add`
- Edit example: `https://iltstudent06.github.io/customer-app/#/edit/101`

## Testing

Run all tests once:

```bash
npm run test:run
```

Run a specific test file:

```bash
npm run test:run -- src/components/CustomerForm.test.tsx
```
