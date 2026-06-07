import { Link } from 'react-router-dom';

export default function BlogCard({ blog, onDelete }) {
  return (
    <article className="blog-card">
      <div className="card-meta">
        <span className="tag">{blog.tags?.[0] || 'General'}</span>
        <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
      </div>
      <h3>{blog.title || 'Untitled post'}</h3>
      <p>{String(blog.content || '').slice(0, 140)}...</p>
      <div className="card-footer">
        <span>{blog.authorName || 'Guest Writer'}</span>
        <div className="card-actions">
          <Link to={`/blogs/${blog._id}`} className="button small">
            View
          </Link>
          <button className="button small secondary" onClick={() => onDelete(blog._id)}>
            Delete
          </button>
        </div>
      </div>
    </article>
  );
}
