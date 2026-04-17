# React Query from Scratch 🚀

A from-scratch implementation of a powerful state management and data-fetching library, inspired by TanStack Query. This project demonstrates how to handle caching, stale-while-revalidate logic, and cache invalidation using the Observer pattern in React.

## 🏗️ Technical Architecture

### 1. The Core State Machine (`createQuery.ts`)
Each query is a self-contained state machine that manages:
- **Status**: `pending`, `success`, or `error`.
- **Caching**: Stores data with a `lastUpdated` timestamp.
- **Deduplication**: Uses a `fetchingPromise` to prevent multiple simultaneous requests for the same key.
- **Invalidation**: Provides an `invalidate()` method to force re-fetches.

### 2. The Central Store (`QueryClient.ts`)
A singleton-like class that manages a `Map` of all queries. It ensures that components requesting the same `queryKey` always receive the exact same query instance, enabling global data sharing.

### 3. The Sync Layer (`useQuery.tsx`)
This hook acts as an **Observer**. It:
- Subscribes to the query on mount.
- Triggers a re-render whenever the query state changes.
- Automatically handles **Stale-Time** logic (only fetches if data is older than the configured `staleTime`).
- Cleans up subscriptions on unmount to prevent memory leaks.

### 4. Mutations (`useMutation.tsx`)
A dedicated hook for data-changing operations (POST/DELETE). It manages the `isPending` state and provides an `onSuccess` callback, typically used to call `queryClient.invalidateQueries()`.

---

## 🛠️ Implementation Details

- **Decoupled Architecture**: Logic is split into `services` (API calls), `hooks` (domain logic), and `components` (UI).
- **Type Safety**: Fully typed with TypeScript interfaces for Queries, Mutations, and Observers.
- **Aesthetics**: Premium dashboard design using Vanilla CSS with CSS Variables, smooth transitions, and custom loaders.

---

## 🚀 Roadmap & Pending Features

We've built the foundation, but there's more to come:

- [ ] **Optimistic Updates**: Update the UI immediately before the server responds, with automatic rollback on error.
- [ ] **Persistence layer**: Sync the `QueryClient` cache with `localStorage` or `IndexedDB` to persist data across refreshes.
- [ ] **Window Focus Refetching**: Automatically refresh stale data when the user switches back to the browser tab.
- [ ] **Infinite Queries**: Support for paginated data and "load more" functionality.
- [ ] **Background Polling**: Configurable `refetchInterval` to keep data live without user interaction.
- [ ] **DevTools Integration**: A custom UI overlay to inspect the current state of the cache.
- [ ] **Retry Logic**: Automatically retry failed requests with exponential backoff.

---

## 💻 Getting Started

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Run Development Server**:
   ```bash
   npm run dev
   ```

3. **Explore the Lab**:
   Use the **Create Post Form** to see real-time cache invalidation in action.
