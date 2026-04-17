# React Query from Scratch 🚀

A from-scratch implementation of a powerful state management and data-fetching library. This demonstrates how to build a production-grade coordination layer for async data using the Observer pattern.

---

## 🏛️ Library Core Implementation

### 1. The Global Store (`QueryClient.ts`)
The `QueryClient` acts as the heart of the library. It maintains the cache in a `Map` and provides methods to retrieve or invalidate queries.

```typescript
import { createQuery } from './createQuery';
import type { Query } from './types';

export class QueryClient {
    private queries: Map<string, Query> = new Map();

    getQuery = ({ queryKey, queryFn }: { queryKey: unknown[]; queryFn: () => Promise<unknown> }): Query => {
        const queryHash = JSON.stringify(queryKey);
        let query = this.queries.get(queryHash);

        if (!query) {
            query = createQuery({ queryKey, queryFn });
            this.queries.set(queryHash, query);
        }
        return query;
    };

    invalidateQueries = (queryKey: unknown[]) => {
        const queryHash = JSON.stringify(queryKey);
        this.queries.get(queryHash)?.invalidate();
    };
}
```

### 2. The Query Machine (`createQuery.ts`)
This is the low-level logic that handles the actual fetching, state updates, and deduplication of requests.

```typescript
export const createQuery = ({ queryKey, queryFn }) => {
    const query = {
        state: { status: 'pending', isFetching: false, ... },
        subscribers: [],
        
        fetch: async () => {
            if (query.fetchingPromise) return query.fetchingPromise;
            query.fetchingPromise = (async () => {
                query.setState(s => ({ ...s, isFetching: true }));
                try {
                    const data = await queryFn();
                    query.setState(s => ({ ...s, status: 'success', data, lastUpdated: Date.now() }));
                } catch (error) {
                    query.setState(s => ({ ...s, status: 'error', error }));
                } finally {
                    query.fetchingPromise = null;
                    query.setState(s => ({ ...s, isFetching: false }));
                }
            })();
            return query.fetchingPromise;
        },

        invalidate: () => {
            query.setState(s => ({ ...s, lastUpdated: 0 }));
            if (query.subscribers.length > 0) query.fetch();
        }
    };
    return query;
};
```

### 3. The Hook Observer (`useQuery.tsx`)
The `useQuery` hook connects React components to the `QueryClient`. It uses `useMemo` for a stable observer and `useEffect` for the subscription lifecycle.

```typescript
export const useQuery = ({ queryKey, queryFn, staleTime = 0 }) => {
    const queryClient = useQueryClient();
    const query = queryClient.getQuery({ queryKey, queryFn });
    const [, setCount] = useState(0);
    const rerender = useCallback(() => setCount(c => c + 1), []);

    const observer = useMemo(() => ({
        notify: rerender,
        getQueryState: () => query.state,
    }), [query, rerender]);

    useEffect(() => {
        const unsubscribe = query.subscribe(observer);
        const isStale = !query.state.lastUpdated || (Date.now() - query.state.lastUpdated > staleTime);
        if (isStale) query.fetch();
        return unsubscribe;
    }, [query, observer, staleTime]);

    return query.state;
};
```

### 4. Side Effects (`useMutation.tsx`)
Handles the "Write" part of CRUD. It gives you a `mutate` function and tracks the lifecycle of an async call.

```typescript
export const useMutation = ({ mutationFn, onSuccess }) => {
  const [state, setState] = useState({ status: 'idle', isPending: false, ... });

  const mutate = useCallback(async (variables) => {
    setState(s => ({ ...s, isPending: true }));
    try {
      const data = await mutationFn(variables);
      setState({ status: 'success', data, isPending: false });
      if (onSuccess) onSuccess(data);
    } catch (error) {
      setState({ status: 'error', error, isPending: false });
    }
  }, [mutationFn, onSuccess]);

  return { ...state, mutate };
};
```

---

## 🛠️ Key Features Summary

- **Global Cache**: Data fetched once is shared across all components via the same `queryKey`.
- **Deduplication**: Simultaneous calls to the same endpoint are funneled into a single network request.
- **Stale-While-Revalidate**: Data is served from the cache instantly, but refetched in the background if it's older than the `staleTime`.
- **Cache Invalidation**: Mutations can "poke" the cache to trigger automatic background refreshes.

---

## 🚀 Roadmap

- [ ] **Optimistic Updates**: Zero-latency UI updates.
- [ ] **LocalStorage Sync**: Persistent cache across page reloads.
- [ ] **Retries**: Automatic exponential backoff for failed requests.
- [ ] **Window Focus**: Refetch when user returns to the tab.
