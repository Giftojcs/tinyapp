const express = require('express');
<<<<<<< HEAD
=======
const session = require('express-session');
>>>>>>> feature/user-registration
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');

const app = express();
const PORT = 5000;

<<<<<<< HEAD
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
=======
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

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

const users = {};
const urlDatabase = {};

>>>>>>> feature/user-registration
function generateRandomID() {
  const characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let randomID = '';
  for (let i = 0; i < 10; i++) {
    randomID += characters[Math.floor(Math.random() * characters.length)];
  }
  return randomID;
}

<<<<<<< HEAD
// Middleware to check if user is logged in
function requireLogin(req, res, next) {
  const userID = req.cookies.user_id;
  if (!userID || !users[userID]) {
    res.status(401).send('You must be logged in to access this page');
=======
function requireLogin(req, res, next) {
  const userID = req.session.user_id;
  if (!userID || !users[userID]) {
    res.redirect('/login');
>>>>>>> feature/user-registration
  } else {
    next();
  }
}

<<<<<<< HEAD
// Routes

app.get('/', (req, res) => {
  const userID = req.cookies.user_id;
=======
app.get('/', (req, res) => {
  const userID = req.session.user_id;
>>>>>>> feature/user-registration
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

<<<<<<< HEAD
=======
  const existingUser = Object.values(users).find(user => user.email === email);
  if (existingUser) {
    res.status(400).send('Email address already registered');
    return;
  }

>>>>>>> feature/user-registration
  const userID = generateRandomID();
  const hashedPassword = bcrypt.hashSync(password, 10);

  users[userID] = {
    id: userID,
    email: email,
    password: hashedPassword
  };

<<<<<<< HEAD
  res.cookie('user_id', userID);
=======
  req.session.user_id = userID;
>>>>>>> feature/user-registration
  res.redirect('/urls');
});

app.post('/login', (req, res) => {
  const { email, password } = req.body;
  const user = Object.values(users).find(user => user.email === email);

<<<<<<< HEAD
  if (!user) {
    res.status(400).send('User not found');
    return;
  }

  if (bcrypt.compareSync(password, user.password)) {
    res.cookie('user_id', user.id);
    res.redirect('/urls');
  } else {
    res.status(400).send('Invalid password');
=======
  if (!user || !bcrypt.compareSync(password, user.password)) {
    res.status(401).send('Invalid email or password');
    return;
>>>>>>> feature/user-registration
  }

  req.session.user_id = user.id;
  res.redirect('/urls');
});

app.post('/logout', (req, res) => {
<<<<<<< HEAD
=======
  req.session.destroy();
>>>>>>> feature/user-registration
  res.clearCookie('user_id');
  res.redirect('/login');
});

app.get('/urls', requireLogin, (req, res) => {
<<<<<<< HEAD
  const userID = req.cookies.user_id;
=======
  const userID = req.session.user_id;
>>>>>>> feature/user-registration
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
<<<<<<< HEAD
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
=======
  const userID = req.session.user_id;
  const user = users[userID];
  res.render('urls_new', { user });
});

app.post('/urls', requireLogin, (req, res) => {
  const userID = req.session.user_id;
  const longURL = req.body.longURL;
  const shortURL = generateRandomID();

  urlDatabase[shortURL] = {
    longURL: longURL,
    userID: userID,
  };

  res.redirect(`/urls/${shortURL}`);
});

app.get('/urls/:shortURL', (req, res) => {
  const shortURL = req.params.shortURL;
  const urlEntry = urlDatabase[shortURL];
  if (urlEntry && urlEntry.longURL) {
    res.render('urls_show', { user: users[req.session.user_id], urls: urlDatabase, shortURL }); // Add `urls` object to the render options
  } else {
    res.status(404).send('URL not found.');
>>>>>>> feature/user-registration
  }

  urlDatabase[shortURL].longURL = newLongURL;

  res.redirect(`/urls/${shortURL}`);
});

<<<<<<< HEAD
app.post('/urls/:id/delete', requireLogin, (req, res) => {
  const userID = req.cookies.user_id;
  const shortURL = req.params.id;
=======

app.post('/urls/:shortURL/delete', requireLogin, (req, res) => {
  const userID = req.session.user_id;
  const shortURL = req.params.shortURL;
>>>>>>> feature/user-registration

  if (!urlDatabase[shortURL] || urlDatabase[shortURL].userID !== userID) {
    res.status(404).send('URL not found');
    return;
  }
<<<<<<< HEAD
=======

  delete urlDatabase[shortURL];
  res.redirect('/urls');
});

app.post('/urls/:shortURL/edit', requireLogin, (req, res) => {
  const userID = req.session.user_id;
  const shortURL = req.params.shortURL;
  const newLongURL = req.body.longURL;

  if (!urlDatabase[shortURL] || urlDatabase[shortURL].userID !== userID) {
    res.status(404).send('URL not found');
    return;
  }

  urlDatabase[shortURL].longURL = newLongURL;
  res.redirect('/urls');
});
>>>>>>> feature/user-registration

  delete urlDatabase[shortURL];

  res.redirect('/urls');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

