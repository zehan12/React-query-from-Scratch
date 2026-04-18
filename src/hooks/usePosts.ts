import { useQuery } from '../lib';
import { postsService, type Post } from '../services/postsService';

export const usePosts = () => {
  return useQuery<Post[]>({
    queryKey: ['postsData'],
    queryFn: postsService.getPosts,
    staleTime: 5000,
  });
};
