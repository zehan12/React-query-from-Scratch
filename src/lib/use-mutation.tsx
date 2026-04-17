import { useState, useCallback } from 'react';
import type { MutationState } from './types';

export const useMutation = ({
  mutationFn,
  onSuccess,
}: {
  mutationFn: (variables: unknown) => Promise<unknown>;
  onSuccess?: (data: unknown) => void;
}) => {
  const [state, setState] = useState<MutationState>({
    status: 'idle',
    data: undefined,
    error: undefined,
    isPending: false,
  });

  const mutate = useCallback(
    async (variables: unknown) => {
      setState({ status: 'pending', data: undefined, error: undefined, isPending: true });

      try {
        const data = await mutationFn(variables);
        setState({ status: 'success', data, error: undefined, isPending: false });
        if (onSuccess) onSuccess(data);
        return data;
      } catch (error: unknown) {
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
