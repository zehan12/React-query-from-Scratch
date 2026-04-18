import { useContext, useState, useMemo, useEffect, useCallback } from 'react';
import { QueryClientContext } from './QueryClientContext';
import type { QueryObserver } from './types';

export const useQuery = <TData = unknown, TError = unknown>({
    queryKey,
    queryFn,
    staleTime = 0,
}: {
    queryKey: unknown[];
    queryFn: () => Promise<TData>;
    staleTime?: number;
}) => {
    const queryClient = useContext(QueryClientContext);
    if (!queryClient) {
        throw new Error('useQuery must be used within a QueryClientProvider');
    }

    const query = queryClient.getQuery<TData, TError>({ queryKey, queryFn });

    // Use state to trigger re-renders
    const [, setCount] = useState(0);
    const rerender = useCallback(() => setCount((c) => c + 1), []);

    // Memoize the observer so it's stable per query
    const observer = useMemo((): QueryObserver<TData, TError> => {
        return {
            notify: rerender,
            getQueryState: () => query.state,
        };
    }, [query, rerender]);

    useEffect(() => {
        // Subscribe the observer to the query
        const unsubscribe = query.subscribe(observer);

        // Check if data is stale or never fetched
        const isStale = !query.state.lastUpdated || (Date.now() - query.state.lastUpdated > staleTime);
        if (isStale) {
            query.fetch();
        }

        return unsubscribe;
    }, [query, observer, staleTime]);

    return query.state;
};