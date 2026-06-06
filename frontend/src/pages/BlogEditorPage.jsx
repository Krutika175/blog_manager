import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api.js';

export default function BlogEditorPage({ editMode = false }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({ title: '', content: '', imageUrl: '', tags: '' });
  const [status, setStatus] = useState('');

  useEffect(() => {
    if (editMode && id) {
      loadBlog();
    }
  }, [editMode, id]);

  const loadBlog = async () => {
    try {
      const response = await api.get(`/api/blogs/${id}`);
      const blog = response.data;
      setForm({
        title: blog.title,
        content: blog.content,
        imageUrl: blog.imageUrl || '',
        tags: (blog.tags || []).join(', '),
      });
    } catch {
      setStatus('Unable to load the selected blog.');
    }
  };

  const handleChange = (field) => (event) => {
    setForm((current) => ({ ...current, [field]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus('Saving…');
    try {
      if (editMode && id) {
        await api.put(`/api/blogs/${id}`, form);
      } else {
        await api.post('/api/blogs', form);
      }
      navigate('/');
    } catch (err) {
      setStatus(err.response?.data?.message || 'Could not save blog.');
    }
  };

  return (
    <section className="editor-page">
      <div className="editor-panel">
        <div className="editor-header">
          <div>
            <p className="eyebrow">{editMode ? 'Edit Post' : 'Create Blog'}</p>
            <h1>{editMode ? 'Refine your existing story' : 'Draft your next feature'}</h1>
          </div>
          <button className="button secondary" onClick={() => navigate('/')}>Back</button>
        </div>

        <form className="editor-form" onSubmit={handleSubmit}>
          <label>
            Article Title
            <input value={form.title} onChange={handleChange('title')} placeholder="Enter a compelling headline..." required />
          </label>
          <label>
            Featured Image URL
            <input value={form.imageUrl} onChange={handleChange('imageUrl')} placeholder="https://images.example.com/cover.jpg" />
          </label>
          <label>
            Category tags
            <input value={form.tags} onChange={handleChange('tags')} placeholder="design, productivity" />
          </label>
          <label>
            Body content
            <textarea value={form.content} onChange={handleChange('content')} placeholder="Start writing your story..." rows="10" required />
          </label>
          <div className="editor-actions">
            <span className="helper-text">MIN 20 CHARACTERS REQUIRED • {form.content.length} words</span>
            <button type="submit" className="button primary">{editMode ? 'Update Blog' : 'Publish Article'}</button>
          </div>
          {status && <div className="form-status">{status}</div>}
        </form>
      </div>
    </section>
  );
}
