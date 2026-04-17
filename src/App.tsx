import { PostList } from './components/PostList';
import { CreatePostForm } from './components/CreatePostForm';
import './App.css';

function App() {
  return (
    <main className="app-layout">
      <header className="main-header">
        <h1>React Query <span className="accent">from Scratch </span></h1>
      </header>

      <div className="dashboard-grid">
        <aside className="sidebar">
          <CreatePostForm />
        </aside>

        <section className="dashboard-content">
          <PostList title="Recent Posts" />
        </section>
      </div>

      <footer className="debug-footer">
        <p>💡 Tip: Mutations will automatically invalidate the cache and refresh this list.</p>
      </footer>
    </main>
  );
}

export default App;