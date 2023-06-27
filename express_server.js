const express = require("express");
const app = express();
const PORT = 3000;

const cookieParser = require('cookie-parser');
app.use(cookieParser());

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");

// Root route
app.get("/", (req, res) => {
  res.send("Hello!");
});

// URLs index route
app.get("/urls", (req, res) => {
  const templateVars = {
    username: req.cookies["username"], // Passes the "username" cookie to the template
    urls: urlDatabase // Passes the urlDatabase object to the template
  };

  if (!req.cookies["username"]) {
    res.cookie("username", "your-username-here"); // Sets a default value for "username" cookie if it doesn't exist
  }

  res.render("urls_index", templateVars); // Renders the "urls_index" template with the provided variables
});

// New URL route
app.get("/urls/new", (req, res) => {
  const templateVars = {
    username: req.cookies["username"] // Passes the "username" cookie to the template
  };
  res.render("urls_new", templateVars); // Renders the "urls_new" template with the provided variables
});

// Show URL route
app.get("/urls/:id", (req, res) => {
  const templateVars = {
    username: req.cookies["username"], // Passes the "username" cookie to the template
    id: req.params.id, // Captures the dynamic parameter ":id"
    longURL: urlDatabase[req.params.id] // Retrieves the corresponding longURL from the urlDatabase
  };
  res.render("urls_show", templateVars); // Renders the "urls_show" template with the provided variables
});

app.get("/login", (req, res) => {
  res.render("login"); // Renders the "login" template
});

app.post("/login", (req, res) => {
  const { username } = req.body; // Retrieve the username from the request body
  res.cookie("username", username); // Set the "username" cookie with the provided value
  res.redirect("/urls"); // Redirect to the URLs index route
});

// Update URL route
app.post("/urls/:id", (req, res) => {
  const urlId = req.params.id;
  const newLongURL = req.body.longURL;
  if (urlDatabase[urlId]) {
    urlDatabase[urlId] = newLongURL;
    res.redirect("/urls"); // Redirects to the URLs index route after updating the longURL
  } else {
    res.status(404).send("URL not found"); // Sends a 404 response if the URL doesn't exist
  }
app.post("/login", (req, res) => {
  const username = req.body.username; // Retrieve the username from the request body
  res.cookie("username", username); // Set the "username" cookie with the provided value
  res.redirect("/urls"); // Redirect to the URLs index route
});


});
app.post("/logout", (req, res) => {
  res.clearCookie("username"); // Clears the "username" cookie
  res.redirect("/urls"); // Redirects to the URLs index route
});


app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});

