# React Query from Scratch 🚀

A from-scratch implementation of a powerful state management and data-fetching library, inspired by TanStack Query. This project demonstrates how to handle caching, stale-while-revalidate logic, and cache invalidation using the Observer pattern in React.

## 🏗️ Technical Architecture

### 1. The Core State Machine (`createQuery.ts`)
Each query is a self-contained state machine that manages its own lifecycle.
```typescript
const query = {
  state: { status: 'pending', data: undefined, ... },
  fetch: async () => {
    // 1. Set loading state
    // 2. Perform async operation
    // 3. Update state & notify observers
  },
  invalidate: () => {
    // Reset lastUpdated to 0 to force next fetch
  }
}
```

### 2. The Central Store (`QueryClient.ts`)
A singleton-like class that ensures multiple components sharing a `queryKey` talk to the same source of truth.
```typescript
const queryClient = new QueryClient();

// Shared cache entry for 'postsData'
const queryA = queryClient.getQuery({ queryKey: ['postsData'], ... });
const queryB = queryClient.getQuery({ queryKey: ['postsData'], ... }); 

// queryA === queryB (True! Global state reached)
```

### 3. The Sync Layer (`useQuery.tsx`)
The hook that connects the component to the query machine via a subscription.
```typescript
export const useQuery = ({ queryKey, queryFn, staleTime }) => {
  const query = queryClient.getQuery({ queryKey, queryFn });
  const [, rerender] = useState(0);

  useEffect(() => {
    // Subscribe and trigger re-render on change
    const unsubscribe = query.subscribe({
      notify: () => rerender(c => c + 1),
      getQueryState: () => query.state
    });
    
    // Auto-fetch if stale
    return unsubscribe;
  }, [query]);

  return query.state;
}
```

### 4. Mutations (`useMutation.tsx`)
Triggers side-effects and manages the data-changing lifecycle.
```typescript
const { mutate, isPending } = useMutation({
  mutationFn: createPost,
  onSuccess: () => {
    // Tell the client that 'postsData' is now dirty
    queryClient.invalidateQueries(['postsData']);
  }
});
```

---

## 🛠️ Implementation Workflow

1.  **Define Types**: Created `QueryState` and `MutationState` interfaces for strict safety.
2.  **State Management**: Built the standard `QueryClient` and `QueryClientProvider` context.
3.  **Observers**: Implemented a notification system where queries don't know about UI components, and UI components only listen for "notify" signals.
4.  **UI Integration**: Modularized the dashboard into reusable components like `PostCard` and `PostList`.

---

## 🚀 Roadmap & Pending Features

- [ ] **Optimistic Updates**: Update the UI immediately before the server responds.
- [ ] **Persistence layer**: Sync the `QueryClient` cache with `localStorage`.
- [ ] **Window Focus Refetching**: Refresh stale data when returning to the tab.
- [ ] **Infinite Queries**: Support for paginated data.
- [ ] **DevTools Integration**: A custom UI to inspect the cache state.

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
