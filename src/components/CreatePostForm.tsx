import React, { useState } from 'react';
import { useMutation, useQueryClient } from '../lib';
import { postsService } from '../services/postsService';

export const CreatePostForm: React.FC = () => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const queryClient = useQueryClient();

    const { mutate, isPending } = useMutation({
        mutationFn: postsService.createPost,
        onSuccess: () => {
            // Invalidate the cache to trigger a refresh
            queryClient.invalidateQueries(['postsData']);
            setName('');
            setDescription('');
        },
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !description) return;
        mutate({ name, description });
    };

    return (
        <form className="create-post-form" onSubmit={handleSubmit}>
            <h3>✨ Create New Post</h3>
            <div className="form-group">
                <input
                    type="text"
                    placeholder="Post Title"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    disabled={isPending}
                />
            </div>
            <div className="form-group">
                <textarea
                    placeholder="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    disabled={isPending}
                ></textarea>
            </div>
            <button type="submit" className="btn-primary" disabled={isPending}>
                {isPending ? 'Creating...' : 'Post Content'}
            </button>
        </form>
    );
};
