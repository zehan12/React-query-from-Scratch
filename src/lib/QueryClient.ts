import { createQuery } from './createQuery';
import type { Query } from './types';

export class QueryClient {
    private queries: Map<string, Query> = new Map();

    getQuery = ({
        queryKey,
        queryFn,
    }: {
        queryKey: unknown[];
        queryFn: () => Promise<unknown>;
    }): Query => {
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
        const query = this.queries.get(queryHash);
        if (query) {
            query.invalidate();
        }
    };
}