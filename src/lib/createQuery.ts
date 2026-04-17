import type { Query } from './types';

export const createQuery = ({
    queryKey,
    queryFn,
}: {
    queryKey: unknown[];
    queryFn: () => Promise<unknown>;
}): Query => {
    const query: Query = {
        queryKey,
        queryHash: JSON.stringify(queryKey),
        state: {
            status: 'pending',
            isFetching: false,
            data: undefined,
            error: undefined,
            lastUpdated: undefined,
        },
        subscribers: [],
        fetchingPromise: null,

        subscribe: (subscriber) => {
            query.subscribers.push(subscriber);
            return () => {
                query.subscribers = query.subscribers.filter(
                    (s) => s !== subscriber
                );
            };
        },

        setState: (updater) => {
            query.state = updater(query.state);
            query.subscribers.forEach((s) => s.notify());
        },

        fetch: async () => {
            if (query.fetchingPromise) return query.fetchingPromise;

            query.fetchingPromise = (async () => {
                query.setState((old) => ({
                    ...old,
                    isFetching: true,
                    error: undefined,
                }));

                try {
                    const data = await queryFn();
                    query.setState((old) => ({
                        ...old,
                        status: 'success',
                        data,
                        lastUpdated: Date.now(),
                    }));
                } catch (error) {
                    query.setState((old) => ({
                        ...old,
                        status: 'error',
                        error,
                    }));
                } finally {
                    query.fetchingPromise = null;
                    query.setState((old) => ({
                        ...old,
                        isFetching: false,
                    }));
                }
            })() as Promise<void>;

            return query.fetchingPromise;
        },

        invalidate: () => {
            query.setState((old) => ({
                ...old,
                lastUpdated: 0,
            }));
            if (query.subscribers.length > 0) {
                query.fetch();
            }
        },
    };

    return query;
};