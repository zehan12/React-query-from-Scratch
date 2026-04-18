import React from 'react';
import { useMutation, useQueryClient } from '../lib';
import { postsService, type Post } from '../services/postsService';

export const PostCard: React.FC<{ post: Post }> = ({ post }) => {
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: (id: number) => postsService.deletePost(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['postsData']);
    },
  });

  return (
    <div className="post-card">
      <div className="post-card-content">
        <h3>{post.name}</h3>
        <p>{post.description}</p>
      </div>
      <button 
        className="btn-delete" 
        onClick={() => mutate(post.id)} 
        disabled={isPending}
      >
        {isPending ? '...' : '🗑️'}
      </button>
    </div>
  );
};
