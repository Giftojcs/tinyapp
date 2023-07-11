const express = require('express');
const cookieSession = require('cookie-session');
const bcrypt = require('bcryptjs'); // Require bcryptjs library
const app = express();
const PORT = 3000;
const helpers = require('./helpers');

app.use(cookieSession({
  name: 'session',
  keys: ['your-secret-key'], // Replace with your own secret key
}));

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));

const urlDatabase = {
  b6UTxQ: {
    longURL: 'https://www.tsn.ca',
    userID: 'aJ48lW',
  },
  i3BoGr: {
    longURL: 'https://www.google.ca',
    userID: 'aJ48lW',
  },
};

const users = {
  aJ48lW: {
    id: 'aJ48lW',
    email: 'user@example.com',
    password: 'password',
  },
};

const urlsForUser = (id) => {
  const userURLs = {};

  for (const shortURL in urlDatabase) {
    if (urlDatabase[shortURL].userID === id) {
      userURLs[shortURL] = urlDatabase[shortURL];
    }
  }

  return userURLs;
};

app.use((req, res, next) => {
  res.locals.user = users[req.session.user_id];
  next();
});

app.get('/', (req, res) => {
  res.redirect('/urls');
});

app.get('/urls', (req, res) => {
  const userID = req.session.user_id;

  if (!userID) {
    res.status(401).send('Please log in or register first.');
    return;
  }

  const userURLs = urlsForUser(userID);
    res.render('urls_index', { urls: userURLs, user: users[userID], showCreateLink: true });
});

app.get('/urls/new', (req, res) => {
  const userID = req.session.user_id;

  if (!userID) {
    res.redirect('/login');
    return;
  }

  res.render('urls_new');
});

app.get('/logout', (req, res) => {
  req.session = null;
  res.redirect('/login');
});


app.get('/urls/:shortURL', (req, res) => {
  const userID = req.session.user_id;
  const shortURL = req.params.shortURL;
  const url = urlDatabase[shortURL];

  if (!url) {
    res.status(404).send('URL not found');
    return;
  }

  if (url.userID !== userID) {
    res.status(403).send('You do not own this URL.');
    return;
  }

  res.render('urls_show', { shortURL, url });
});

app.post('/urls', (req, res) => {
  const userID = req.session.user_id;

  if (!userID) {
    res.status(401).send('Please log in or register first.');
    return;
  }

  const shortURL = generateRandomString();
  const longURL = req.body.longURL;

  urlDatabase[shortURL] = { longURL, userID };
  res.redirect(`/urls/${shortURL}`);
});

app.post('/urls/:shortURL', (req, res) => {
  const userID = req.session.user_id;
  const shortURL = req.params.shortURL;
  const updatedURL = req.body.longURL;
  const url = urlDatabase[shortURL];

  if (!userID) {
    res.status(401).send('Please log in or register first.');
    return;
  }

  if (!url || url.userID !== userID) {
    res.status(403).send('You do not own this URL.');
    return;
  }

  url.longURL = updatedURL;
  res.redirect('/urls');
});

app.post('/urls/:shortURL/delete', (req, res) => {
  const userID = req.session.user_id;
  const shortURL = req.params.shortURL;
  const url = urlDatabase[shortURL];

  if (!userID) {
    res.status(401).send('Please log in or register first.');
    return;
  }

  if (!url || url.userID !== userID) {
    res.status(403).send('You do not own this URL.');
    return;
  }

  delete urlDatabase[shortURL];
  res.redirect('/urls');
});

app.get('/register', (req, res) => {
  res.render('register');
});

app.post('/register', (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  if (!email || !password) {
    res.status(400).send('Email and password fields are required.');
    return;
  }

  for (const userId in users) {
    if (users[userId].email === email) {
      res.status(400).send('Email already registered.');
      return;
    }
  }

  const userId = generateRandomString();
  const hashedPassword = bcrypt.hashSync(password, 10); // Hash the password using bcrypt
  users[userId] = { id: userId, email, password: hashedPassword }; // Save the hashed password

  req.session.user_id = userId;
  res.redirect('/urls');
});

app.get('/login', (req, res) => {
  res.render('login');
});

app.post('/login', (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  if (!email || !password) {
    res.status(400).send('Email and password fields are required.');
    return;
  }

  const user = helpers.getUserByEmail(email, users);

  if (!user || !bcrypt.compareSync(password, user.password)) {
    res.status(403).send('Invalid email or password.'); // Compare hashed password with provided password
    return;
  }

  req.session.user_id = user.id;
  res.redirect('/urls');
});

app.post('/logout', (req, res) => {
  req.session = null;
  res.redirect('/login');
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

function generateRandomString() {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const length = 6;

  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

