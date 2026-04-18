import { createQuery } from './createQuery';
import type { Query } from './types';

export class QueryClient {
    private queries: Map<string, Query<any, any>> = new Map();

    getQuery = <TData = unknown, TError = unknown>({
        queryKey,
        queryFn,
    }: {
        queryKey: unknown[];
        queryFn: () => Promise<TData>;
    }): Query<TData, TError> => {
        const queryHash = JSON.stringify(queryKey);
        let query = this.queries.get(queryHash) as Query<TData, TError> | undefined;

        if (!query) {
            query = createQuery<TData, TError>({ queryKey, queryFn });
            this.queries.set(queryHash, query);
        }

        return query;
    };

    invalidateQueries = (queryKey: unknown[]) => {
        const queryHash = JSON.stringify(queryKey);
        const query = this.queries.get(queryHash);
        if (query) {
            query.invalidate();
        }
    };
}