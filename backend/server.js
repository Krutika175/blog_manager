const path = require('node:path');
const dns = require('dns');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const blogRoutes = require('./routes/blogs');

// Use a stable public DNS resolver for Atlas SRV record lookups.
dns.setServers(['8.8.8.8', '1.1.1.1']);

const app = express();
const PORT = process.env.PORT || 4000;
const CLIENT_HOME_URL = (process.env.CLIENT_HOME_URL || 'http://localhost:5173').replace(/\/+$/, '');

if (!process.env.MONGODB_URI) {
  console.error('Missing MONGODB_URI environment variable. Set it in Render or your local .env file.');
  process.exit(1);
}

mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => {
    console.error('MongoDB connection failed:', err);
    process.exit(1);
  });

mongoose.connection.on('connected', () => {
  console.log('Mongoose connected to MongoDB.');
});

mongoose.connection.on('error', (err) => {
  console.error('Mongoose connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.warn('Mongoose disconnected from MongoDB.');
});

const allowedOrigins = [
  CLIENT_HOME_URL,
  'https://blog-manager-bice.vercel.app',
  'https://blog-manager-git-main-krutika-001-s-projects.vercel.app',
  'https://blog-manager-s7gvlc908-krutika-001-s-projects.vercel.app',
];

app.use(
  cors({
    origin(origin, callback) {
      if (!origin) {
        return callback(null, true);
      }
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      console.warn('CORS origin rejected:', origin);
      return callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
  })
);
app.use(express.json());

app.use('/api/blogs', blogRoutes);

app.get('/api/ping', (req, res) => {
  res.json({ status: 'ok' });
});

if (process.env.NODE_ENV === 'production') {
  // This backend deployment is for APIs only. The frontend is served separately.
  console.log('Running in production mode as backend-only service.');
}

app.get('/', (req, res) => {
  res.send('QuirkWrite backend is running. Use the frontend URL to access the app.');
});

app.listen(PORT, () => {
  console.log(`QuirkWrite backend listening on port ${PORT}`);
});
