export type QueryStatus = 'pending' | 'success' | 'error';

export interface QueryState<TData = unknown, TError = unknown> {
  status: QueryStatus;
  isFetching: boolean;
  data: TData | undefined;
  error: TError | undefined;
  lastUpdated: number | undefined;
}

export interface QueryObserver {
  notify: () => void;
  getQueryState: () => QueryState;
}

export interface Query<TData = unknown, TError = unknown> {
  queryKey: unknown[];
  queryHash: string;
  state: QueryState<TData, TError>;
  subscribers: QueryObserver[];
  fetchingPromise: Promise<void> | null;
  subscribe: (subscriber: QueryObserver) => () => void;
  setState: (updater: (oldState: QueryState<TData, TError>) => QueryState<TData, TError>) => void;
  fetch: () => Promise<void>;
  invalidate: () => void;
}

export interface QueryClientInterface {
  getQuery: (options: { queryKey: unknown[]; queryFn: () => Promise<unknown> }) => Query;
  invalidateQueries: (queryKey: unknown[]) => void;
}

export interface MutationState<TData = unknown, TError = unknown> {
  status: 'idle' | 'pending' | 'success' | 'error';
  data: TData | undefined;
  error: TError | undefined;
  isPending: boolean;
}
