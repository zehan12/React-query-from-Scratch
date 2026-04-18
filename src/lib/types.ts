export type QueryStatus = 'pending' | 'success' | 'error';

export interface QueryState<TData = unknown, TError = unknown> {
  status: QueryStatus;
  isFetching: boolean;
  data: TData | undefined;
  error: TError | undefined;
  lastUpdated: number | undefined;
}

export interface QueryObserver<TData = unknown, TError = unknown> {
  notify: () => void;
  getQueryState: () => QueryState<TData, TError>;
}

export interface Query<TData = unknown, TError = unknown> {
  queryKey: unknown[];
  queryHash: string;
  state: QueryState<TData, TError>;
  subscribers: QueryObserver<TData, TError>[];
  fetchingPromise: Promise<void> | null;
  subscribe: (subscriber: QueryObserver<TData, TError>) => () => void;
  setState: (updater: (oldState: QueryState<TData, TError>) => QueryState<TData, TError>) => void;
  fetch: () => Promise<void>;
  invalidate: () => void;
}

export interface QueryClientInterface {
  getQuery: <TData = unknown, TError = unknown>(options: { queryKey: unknown[]; queryFn: () => Promise<TData> }) => Query<TData, TError>;
  invalidateQueries: (queryKey: unknown[]) => void;
}

export interface MutationState<TData = unknown, TError = unknown> {
  status: 'idle' | 'pending' | 'success' | 'error';
  data: TData | undefined;
  error: TError | undefined;
  isPending: boolean;
}
