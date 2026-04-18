export interface Post {
  id: number;
  name: string;
  description: string;
}

// Local mock DB to demonstrate persistence and mutations
let posts: Post[] = [
  { id: 1, name: 'Building React Query', description: 'A deep dive into state management.' },
  { id: 2, name: 'TypeScript Magic', description: 'Leveraging types for cleaner code.' },
  { id: 3, name: 'Vite Speed', description: 'Why Vite is the future of frontend tooling.' },
  { id: 4, name: 'Micro-interactions', description: 'Small details with big impact.' },
];

export const postsService = {
  getPosts: async (): Promise<Post[]> => {
    console.log('📡 [Service] Fetching posts...');
    return new Promise((resolve) => {
      setTimeout(() => resolve([...posts]), 800);
    });
  },

  createPost: async (newPost: { name: string; description: string }) => {
    console.log('🚀 [Service] Creating post...', newPost);
    return new Promise((resolve) => {
      setTimeout(() => {
        const post = { ...newPost, id: Date.now() };
        posts = [post, ...posts];
        resolve(post);
      }, 1000);
    });
  },

  deletePost: async (id: number) => {
    console.log('🗑️ [Service] Deleting post...', id);
    return new Promise((resolve) => {
      setTimeout(() => {
        posts = posts.filter((p) => p.id !== id);
        resolve({ success: true });
      }, 800);
    });
  },
};
