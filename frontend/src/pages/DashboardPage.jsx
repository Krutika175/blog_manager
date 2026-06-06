import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api.js';
import BlogCard from '../components/BlogCard.jsx';

export default function DashboardPage() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadBlogs();
  }, []);

  const loadBlogs = async () => {
    setLoading(true);
    try {
      const response = await api.get('/api/blogs');
      setBlogs(response.data);
    } catch (err) {
      setError('Unable to load blogs.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this blog?')) {
      return;
    }
    try {
      await api.delete(`/api/blogs/${id}`);
      setBlogs((current) => current.filter((item) => item._id !== id));
    } catch (err) {
      setError('Could not delete blog.');
    }
  };

  return (
    <section className="dashboard-page">
      <div className="page-header">
        <div>
          <p className="eyebrow">Dashboard</p>
          <h1>Your Quirky Blog Studio</h1>
        </div>
        <button className="button primary" onClick={() => navigate('/create')}>
          Create Blog
        </button>
      </div>

      <p className="hero-text">Manage posts, review drafts, and keep your editorial flow polished in one place.</p>

      {loading ? (
        <div className="loading-card">Loading blogs…</div>
      ) : error ? (
        <div className="status-card error">{error}</div>
      ) : blogs.length === 0 ? (
        <div className="status-card">No blogs found yet. Start writing your first post.</div>
      ) : (
        <div className="blog-grid">
          {blogs.map((blog) => (
            <BlogCard key={blog._id} blog={blog} onDelete={handleDelete} />
          ))}
        </div>
      )}
    </section>
  );
}
