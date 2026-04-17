import React from 'react';
import { usePosts } from '../hooks/usePosts';
import { PostCard } from './PostCard';

interface PostListProps {
  title: string;
}

export const PostList: React.FC<PostListProps> = ({ title }) => {
  const { status, isFetching, error, data } = usePosts();

  return (
    <div className="posts-container">
      <div className="header">
        <h2>{title}</h2>
        {isFetching && <span className="loader-mini" title="Refreshing data..."></span>}
      </div>

      {status === 'pending' ? (
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading posts...</p>
        </div>
      ) : error ? (
        <div className="error-state">
          <p>❌ Error loading posts: {(error as unknown as { message: string }).message}</p>
        </div>
      ) : (
        <div className="post-list">
          {(data as unknown[])?.map((post: { id: number, name: string, description: string }) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
};
