const express = require('express');
const router = express.Router();

// GET /login
router.get('/login', (req, res) => {
  res.render('login');
});

// POST /login
router.post('/login', (req, res) => {
  const { email, password } = req.body;
  // Perform login logic and set user session
  // Assuming you have a user ID, you can set it in the session
  const userId = 'user123'; // Replace 'user123' with the actual user ID
  req.session.user_id = userId; // Set the user session ID
  res.redirect('/urls');
});

// GET /register
router.get('/register', (req, res) => {
  res.render('register');
});

// POST /register
router.post('/register', (req, res) => {
  const { email, password } = req.body;
  // Perform registration logic and set user session
  // Assuming you have a user ID, you can set it in the session
  const userId = 'user123'; // Replace 'user123' with the actual user ID
  req.session.user_id = userId; // Set the user session ID
  res.redirect('/urls');
});

// POST /logout
router.post('/logout', (req, res) => {
  req.session = null; // Clear user session
  res.redirect('/login');
});

module.exports = router;

