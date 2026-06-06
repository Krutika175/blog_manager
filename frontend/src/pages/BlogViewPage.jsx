import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import api from '../api.js';

export default function BlogViewPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    api.get(`/api/blogs/${id}`)
      .then((response) => setBlog(response.data))
      .catch(() => setError('Unable to load blog post.'));
  }, [id]);

  if (error) {
    return <div className="status-card error">{error}</div>;
  }

  if (!blog) {
    return <div className="loading-card">Loading blog post…</div>;
  }

  return (
    <article className="blog-view">
      <div className="view-header">
        <button className="button secondary" onClick={() => navigate(-1)}>
          Back
        </button>
        <Link className="button" to={`/blogs/${id}/edit`}>
          Edit
        </Link>
      </div>
      {blog.imageUrl && <img className="feature-image" src={blog.imageUrl} alt={blog.title} />}
      <div className="view-meta">
        <span className="tag">{blog.tags?.[0] || 'General'}</span>
        <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
      </div>
      <h1>{blog.title}</h1>
      <p className="blog-author">By {blog.authorName}</p>
      <div className="blog-content">{blog.content.split('\n').map((line, index) => <p key={index}>{line}</p>)}</div>
    </article>
  );
}
