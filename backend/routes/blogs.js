const router = require('express').Router();
const Blog = require('../models/Blog');

router.get('/', async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 }).populate('author', 'displayName avatar');
    return res.json(blogs);
  } catch (error) {
    return res.status(500).json({ message: 'Unable to load blogs.' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id).populate('author', 'displayName avatar');
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found.' });
    }
    return res.json(blog);
  } catch (error) {
    return res.status(500).json({ message: 'Unable to load blog.' });
  }
});

router.post('/', async (req, res) => {
  const { title, content, imageUrl, tags, authorName } = req.body;
  if (!title || !content) {
    return res.status(400).json({ message: 'Title and content are required.' });
  }

  try {
    const blog = await Blog.create({
      title,
      content,
      imageUrl,
      tags: Array.isArray(tags) ? tags : String(tags || '').split(',').map((tag) => tag.trim()).filter(Boolean),
      authorName: authorName || 'Guest Writer',
    });
    return res.status(201).json(blog);
  } catch (error) {
    return res.status(500).json({ message: 'Unable to create blog.' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found.' });
    }

    const { title, content, imageUrl, tags, authorName } = req.body;
    blog.title = title || blog.title;
    blog.content = content || blog.content;
    blog.imageUrl = imageUrl || blog.imageUrl;
    blog.tags = Array.isArray(tags) ? tags : String(tags || '').split(',').map((tag) => tag.trim()).filter(Boolean);
    blog.authorName = authorName || blog.authorName || 'Guest Writer';
    blog.updatedAt = Date.now();

    await blog.save();
    return res.json(blog);
  } catch (error) {
    return res.status(500).json({ message: 'Unable to update blog.' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found.' });
    }
    await blog.remove();
    return res.json({ success: true });
  } catch (error) {
    return res.status(500).json({ message: 'Unable to delete blog.' });
  }
});

module.exports = router;
