const express = require('express');
const session = require('express-session');
const bcrypt = require('bcrypt');
const app = express();
const PORT = 5000;

// Middleware and configuration setup
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(
  session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true,
  })
);

// Temporary user database (for demo purposes only)
const users = {};

// Temporary URL database (for demo purposes only)
const urlDatabase = {};

// Home page
app.get('/', (req, res) => {
  res.send('Welcome to TinyApp!');
});

// Registration page
app.get('/register', (req, res) => {
  res.render('register');
});

// Registration endpoint
app.post('/register', (req, res) => {
  const { email, password } = req.body;

  // Check if the email already exists in the user database
  const userExists = Object.values(users).find(user => user.email === email);
  if (userExists) {
    res.status(400).send('User already exists.');
    return;
  }

  // Generate a unique user ID
  const userId = generateRandomString();

  // Hash the password
  const hashedPassword = bcrypt.hashSync(password, 10);

  // Create a new user object
  const newUser = {
    id: userId,
    email: email,
    password: hashedPassword,
  };

  // Store the new user in the user database
  users[userId] = newUser;

  // Set the user session
  req.session.user_id = userId;

  res.redirect('/urls');
});

// Login page
app.get('/login', (req, res) => {
  res.render('login');
});

// Login endpoint
app.post('/auth/login', (req, res) => {
  const { email, password } = req.body;

  // Find the user with the matching email in the user database
  const user = Object.values(users).find(user => user.email === email);

  // Check if the user exists and the password is correct
  if (user && bcrypt.compareSync(password, user.password)) {
    // Set the user session
    req.session.user_id = user.id;
    res.redirect('/urls');
  } else {
    res.status(401).send('Invalid email or password.');
  }
});

// Logout endpoint
app.post('/logout', (req, res) => {
  // Clear the user session
  req.session.destroy();
  res.redirect('/login');
});

// Shorten URL
app.post('/urls', (req, res) => {
  if (req.session.user_id) {
    const longURL = req.body.longURL;
    const shortURL = generateRandomString();
    urlDatabase[shortURL] = { longURL: longURL, userID: req.session.user_id };
    res.redirect(`/urls/${shortURL}`);
  } else {
    res.status(401).send('Please log in to create a shortened URL.');
  }
});

// Display URLs
app.get('/urls', (req, res) => {
  if (req.session.user_id) {
    const userURLs = Object.values(urlDatabase).filter(url => url.userID === req.session.user_id);
    res.render('urls', { urls: userURLs });
  } else {
    res.redirect('/login');
  }
});

// Redirect to long URL
app.get('/u/:shortURL', (req, res) => {
  const shortURL = req.params.shortURL;
  const urlEntry = urlDatabase[shortURL];
  if (urlEntry && urlEntry.longURL) {
    res.redirect(urlEntry.longURL);
  } else {
    res.status(404).send('URL not found.');
  }
});

// Helper function to generate a random alphanumeric string
function generateRandomString() {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const length = 6;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

