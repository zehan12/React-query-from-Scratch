import { useQuery } from '../lib';
import { postsService } from '../services/postsService';

export const usePosts = () => {
  return useQuery({
    queryKey: ['postsData'],
    queryFn: postsService.getPosts,
    staleTime: 5000,
  });
};
