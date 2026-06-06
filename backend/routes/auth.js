const router = require('express').Router();
const passport = require('passport');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { googleConfigured } = require('../config/passport');

router.post('/signup', async (req, res) => {
  const { email, password, fullName } = req.body;
  if (!email || !password || !fullName) {
    return res.status(400).json({ message: 'Email, full name, and password are required.' });
  }
  if (password.length < 6) {
    return res.status(400).json({ message: 'Password must be at least 6 characters.' });
  }

  try {
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(409).json({ message: 'Email already exists.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      email: email.toLowerCase(),
      password: hashedPassword,
      displayName: fullName,
    });

    req.login(user, (err) => {
      if (err) {
        return res.status(500).json({ message: 'Unable to sign up.' });
      }
      return res.json({ user });
    });
  } catch (error) {
    return res.status(500).json({ message: 'Unable to sign up.' });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required.' });
  }

  try {
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user || !user.password) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    req.login(user, (err) => {
      if (err) {
        return res.status(500).json({ message: 'Unable to log in.' });
      }
      return res.json({ user });
    });
  } catch (error) {
    return res.status(500).json({ message: 'Unable to log in.' });
  }
});

router.get('/google', (req, res, next) => {
  if (!googleConfigured) {
    return res.status(501).json({ message: 'Google OAuth is not configured on the backend.' });
  }
  next();
},
passport.authenticate('google', {
  scope: ['profile', 'email'],
  prompt: 'select_account',
})
);

router.get('/google/callback', (req, res, next) => {
  if (!googleConfigured) {
    return res.status(501).json({ message: 'Google OAuth is not configured on the backend.' });
  }
  next();
},
passport.authenticate('google', {
  failureRedirect: `${process.env.CLIENT_HOME_URL || 'http://localhost:5173'}/login`,
  session: true,
}),
(req, res) => {
  res.redirect(process.env.CLIENT_HOME_URL || 'http://localhost:5173');
}
);

router.get('/user', (req, res) => {
  if (!req.user) {
    return res.json({ user: null });
  }
  return res.json({ user: req.user });
});

router.post('/logout', (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.session.destroy(() => {
      res.clearCookie('connect.sid');
      return res.json({ success: true });
    });
  });
});

module.exports = router;
