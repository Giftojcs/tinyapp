const express = require('express');
const router = express.Router();

// GET /urls
router.get('/', (req, res) => {
  if (req.session.user_id) {
    const username = req.session.username; // Assuming you have the username stored in the session
    res.render('urls_index', { username: username });
  } else {
    res.status(401).send('Please log in to access this page.');
  }
});

// GET /urls
app.get('/urls', (req, res) => {
  const urls = Object.values(urlDatabase);
  res.render('urls', { urls });
});



// GET /urls/new
router.get('/new', (req, res) => {
  if (req.session.user_id) {
    const username = req.session.username; // Assuming you have the username stored in the session
    res.render('urls_new', { username: username }); // Pass the username to the view
  } else {
    res.redirect('/login');
  }
});


// POST /urls
router.post('/', (req, res) => {
  if (req.session.user_id) {
    // Create a new URL logic
    res.redirect('/urls/:id'); // Replace :id with the newly created URL's ID
  } else {
    res.status(401).send('Please log in to create a URL.');
  }
});

// GET /urls/:id
router.get('/:id', (req, res) => {
  if (req.session.user_id) {
    // Check user's logged-in state and URL ownership, then render appropriate content
    res.render('urls_show');
  } else {
    res.status(401).send('Please log in to access this page.');
  }
});

// POST /urls/:id
router.post('/:id', (req, res) => {
  if (req.session.user_id) {
    // Check user's logged-in state and URL ownership, then update the URL
    res.redirect('/urls');
  } else {
    res.status(401).send('Please log in to update the URL.');
  }
});

// POST /urls/:id/delete
router.post('/:id/delete', (req, res) => {
  if (req.session.user_id) {
    // Check user's logged-in state and URL ownership, then delete the URL
    res.redirect('/urls');
  } else {
    res.status(401).send('Please log in to delete the URL.');
  }
});

module.exports = router;

