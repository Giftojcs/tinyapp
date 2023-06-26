const express = require("express");
const app = express();
const PORT = 3000;

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.send("Hello!");
});

app.get("/urls", (req, res) => {
  const templateVars = { urls: urlDatabase };
  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

app.get("/urls/:id", (req, res) => {
  const templateVars = { id: req.params.id, longURL: urlDatabase[req.params.id] };
  res.render("urls_show", templateVars);
});

app.post("/urls/:id", (req, res) => {
  const urlId = req.params.id;
  const newLongURL = req.body.longURL;
  if (urlDatabase[urlId]) {
    urlDatabase[urlId] = newLongURL;
    res.redirect("/urls");
  } else {
    res.status(404).send("URL not found");
  }
});

app.post("/urls/:id/delete", (req, res) => {
  const urlId = req.params.id;
  if (urlDatabase[urlId]) {
    delete urlDatabase[urlId];
    res.redirect("/urls");
  } else {
    res.status(404).send("URL not found");
  }
});

app.post("/login", (req, res) => {
  const username = req.body.username;
  res.cookie("username", username);
  res.redirect("/urls");
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

