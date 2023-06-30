const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');

const app = express();
const PORT = 5000;

// Set the view engine to EJS
app.set('view engine', 'ejs');

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

// Global object to store users
const users = {};

// Global object to store URLs
const urlDatabase = {};

// Generate random ID function
function generateRandomID() {
  const characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let randomID = '';
  for (let i = 0; i < 10; i++) {
    randomID += characters[Math.floor(Math.random() * characters.length)];
  }
  return randomID;
}

// Middleware to check if user is logged in
function requireLogin(req, res, next) {
  const userID = req.cookies.user_id;
  if (!userID || !users[userID]) {
    res.status(401).send('You must be logged in to access this page');
  } else {
    next();
  }
}

// Routes

app.get('/', (req, res) => {
  const userID = req.cookies.user_id;
  if (!userID || !users[userID]) {
    res.redirect('/login');
  } else {
    res.redirect('/urls');
  }
});

app.get('/login', (req, res) => {
  res.render('login');
});

app.get('/register', (req, res) => {
  res.render('register');
});

app.post('/register', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).send('Email and password are required');
    return;
  }

  const userID = generateRandomID();
  const hashedPassword = bcrypt.hashSync(password, 10);

  users[userID] = {
    id: userID,
    email: email,
    password: hashedPassword
  };

  res.cookie('user_id', userID);
  res.redirect('/urls');
});

app.post('/login', (req, res) => {
  const { email, password } = req.body;
  const user = Object.values(users).find(user => user.email === email);

  if (!user) {
    res.status(400).send('User not found');
    return;
  }

  if (bcrypt.compareSync(password, user.password)) {
    res.cookie('user_id', user.id);
    res.redirect('/urls');
  } else {
    res.status(400).send('Invalid password');
  }
});

app.post('/logout', (req, res) => {
  res.clearCookie('user_id');
  res.redirect('/login');
});

app.get('/urls', requireLogin, (req, res) => {
  const userID = req.cookies.user_id;
  const user = users[userID];
  const userURLs = Object.keys(urlDatabase)
    .filter(shortURL => urlDatabase[shortURL].userID === userID)
    .reduce((obj, key) => {
      obj[key] = urlDatabase[key];
      return obj;
    }, {});

  res.render('urls', { user, urls: userURLs });
});

app.get('/urls/new', requireLogin, (req, res) => {
  const userID = req.cookies.user_id;
  const user = users[userID];
  res.render('urls_new', { user });
});

app.post('/urls', requireLogin, (req, res) => {
  const userID = req.cookies.user_id;
  const longURL = req.body.longURL;
  const shortURL = generateRandomID();

  urlDatabase[shortURL] = {
    longURL: longURL,
    userID: userID
  };

  res.redirect(`/urls/${shortURL}`);
});

app.get('/urls/:id', requireLogin, (req, res) => {
  const userID = req.cookies.user_id;
  const user = users[userID];
  const shortURL = req.params.id;
  const url = urlDatabase[shortURL];

  if (!url || url.userID !== userID) {
    res.status(404).send('URL not found');
    return;
  }

  res.render('urls_show', { user, shortURL, url });
});

app.post('/urls/:id', requireLogin, (req, res) => {
  const userID = req.cookies.user_id;
  const shortURL = req.params.id;
  const newLongURL = req.body.longURL;

  if (!urlDatabase[shortURL] || urlDatabase[shortURL].userID !== userID) {
    res.status(404).send('URL not found');
    return;
  }

  urlDatabase[shortURL].longURL = newLongURL;

  res.redirect(`/urls/${shortURL}`);
});

app.post('/urls/:id/delete', requireLogin, (req, res) => {
  const userID = req.cookies.user_id;
  const shortURL = req.params.id;

  if (!urlDatabase[shortURL] || urlDatabase[shortURL].userID !== userID) {
    res.status(404).send('URL not found');
    return;
  }

  delete urlDatabase[shortURL];

  res.redirect('/urls');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

