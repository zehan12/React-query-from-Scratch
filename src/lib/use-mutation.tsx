import { useState, useCallback } from 'react';
import type { MutationState } from './types';

export const useMutation = <TData = unknown, TError = unknown, TVariables = void>({
  mutationFn,
  onSuccess,
}: {
  mutationFn: (variables: TVariables) => Promise<TData>;
  onSuccess?: (data: TData) => void;
}) => {
  const [state, setState] = useState<MutationState<TData, TError>>({
    status: 'idle',
    data: undefined,
    error: undefined,
    isPending: false,
  });

  const mutate = useCallback(
    async (variables: TVariables) => {
      setState({ status: 'pending', data: undefined, error: undefined, isPending: true });

      try {
        const data = await mutationFn(variables);
        setState({ status: 'success', data, error: undefined, isPending: false });
        if (onSuccess) onSuccess(data);
        return data;
      } catch (error: any) {
        setState({ status: 'error', data: undefined, error, isPending: false });
        throw error;
      }
    },
    [mutationFn, onSuccess]
  );

  return {
    ...state,
    mutate,
  };
};
