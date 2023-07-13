// helpers.js

const bcrypt = require('bcryptjs');

const getUserByEmail = function(email, users) {
  for (const userId in users) {
    const user = users[userId];
    if (user.email === email) {
      return user;
    }
  }
  return null;
};

const comparePasswords = function(password, hashedPassword) {
  return bcrypt.compareSync(password, hashedPassword);
};

const urlsForUser = (id,urlDatabase) => {
  const userURLs = {};

  for (const shortURL in urlDatabase) {
    if (urlDatabase[shortURL].userID === id) {
      userURLs[shortURL] = urlDatabase[shortURL];
    }
  }

  return userURLs;
};

module.exports = { getUserByEmail, comparePasswords, urlsForUser };

