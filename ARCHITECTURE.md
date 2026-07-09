# Component hierarchy and how components are organized (pages, components, hooks, types, context)

The component hierarchy organizes the UI into parent/child parts so the app is easier to build and maintain. Each component has a focused job. Shared UI/logic is reused across pages instead of duplicated. Props/context move data in a clear structure from higher-level containers to lower-level UI. The component hierarchy turns a large UI into smaller components so each part is easier to read, test, and refactor.

The app is organized from top-level composition down to data/state layers:

1. Entry + Provider Layer
2. App Shell + Routing Layer
3. Pages (Route-Level Containers)
4. Reusable Components
5. Hooks (Behavior + Data Orchestration)
6. Context + Reducer State Management
7. Types + Data Contracts

# State management strategy — how Context API + useReducer are used, action types, and data flow

The state management strategy is to keep the app’s customer data consistent and shared correctly across UI. It centralizes customer list state and keeps mutation logic predictable and testable.

Context API + useReducer are used together as a global customer-state store. Context API provides shared access to customer state and dispatch across the app. useReducer manages state transitions in one predictable place. Context shares the state, and useReducer controls how that state changes.

Action types are used for customer state updates. The app uses the following action types:

1. ADD_CUSTOMER to add one new customer to the existing array
2. UPDATE_CUSTOMER to replace the matching customer (by id) with updated data
3. DELETE_CUSTOMER to remove a customer by id
4. SET_CUSTOMERS to replace the whole customer list after fetch/search/sort/pagination results.

The data flow is UI pages call methods from useCustomerApi.
useCustomerApi performs API call (or demo fallback logic).
On success/fallback result, it dispatches reducer actions (mainly SET_CUSTOMERS). Reducer computes next state.

# Custom hooks (e.g., useCustomerApi, useCustomers) and what logic they encapsulate

The useCustomerAPI hook encapsulates the customer data operations logic:

1. Read list with server-side query params (page, limit, search, sort).
2. Create, update, and delete operations.
3. Loading/error state management for all operations.
4. Demo fallback mode when API is unavailable (uses sample data and local in-memory mutations).
5. Syncs results into global reducer/context state via dispatch.
6. Exposes a clean API to pages: customers, totalCustomers, loading, error, fetchCustomers, getCustomerById, addCustomer, updateCustomer, deleteCustomer.

# React Router structure: routes for list, add, and edit views

The app uses React Router with a shared layout and three main routes:

HashRouter is used at the top level in App.tsx, which is compatible with GitHub Pages.

All routes are nested under a parent route that renders Layout so header/shell UI is shared.

Route map:

1. ListPage (customer list, search/sort/pagination, delete)
2. AddPage (create new customer)
3. EditPage (edit an existing customer by route param ID)

# JSON Server API integration and Vite proxy configuration

JSON Server API integration and Vite proxy configuration make local development simple, realistic, and consistent with a production-style frontend API flow.

JSON Server integration provides a quick mock REST backend (CRUD + query params) without building a custom server. It lets the app exercise real network behavior: loading, errors, pagination, sorting, search, create/update/delete. It also persists local data in db.json so development/testing is repeatable.

Vite proxy configuration lets frontend code call a clean relative API path (/api/...) instead of hardcoding http://localhost:3001. It forwards /api requests from Vite dev server to JSON Server and rewrites the path.

# Key technical decisions and trade-offs you made

Several key technical decisions and trade-offs made in this app are:

1. HashRouter for deployment compatibility

Decision: Use hash-based routing for GitHub Pages.

Benefit: Avoids deep-link 404 issues on static hosting.

Trade-off: URL format includes #/, less clean than history-based routing.

2. Demo fallback mode when API is unavailable

Decision: Gracefully degrade to local sample/in-memory data.

Benefit: Deployed app remains functional for UI demonstration even without a live backend.

Trade-off: Persistence is session-only in fallback; user actions can appear saved but reset on reload.

3. Utilize useCustomerApi as a single data orchestration hook

Decision: Encapsulate CRUD operations, loading/error handling, query params, and fallback logic in one hook.

Benefit: Pages stay thin; data behavior is consistent and reusable.

Trade-off: Hook grows in complexity and becomes a critical dependency point.
