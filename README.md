URL Shortener
URL Shortener is a web application built with Node.js that allows users to shorten long URLs, similar to services like TinyURL.com and bit.ly. Users can create an account, log in, and manage their shortened URLs.

Features:

User authentication: Users can create an account, log in, and log out.
Shorten URLs: Users can enter a long URL and get a shortened URL in return.
View and manage URLs: Users can view a list of their shortened URLs, edit the URLs, and delete them if needed.

User Stories:

As an avid twitter poster, I want to be able to shorten links so that I can fit more non-link text in my tweets.
As a twitter reader, I want to be able to visit sites via shortened links so that I can read interesting content.
(Stretch) As an avid twitter poster, I want to be able to see how many times my subscribers visit my links so that I can learn what content they like.

Technologies Used:
Node.js
Express.js
MongoDB
EJS (templating engine for HTML views)

Getting Started:

Clone the repository: git clone <https://github.com/Giftojcs/tinyapp.git>
Install the dependencies: npm install
Set up the database connection in the config/database.js file.
Start the server: npm start
Access the application in your browser at http://localhost:3000
Project Structure
app.js: Entry point of the application.
config/: Configuration files for the application.
controllers/: Contains route handlers for different routes.
models/: Database models.
public/: Static files (CSS, JavaScript, images).
routes/: Defines the application routes.
views/: EJS templates for rendering HTML views.

Routes:
GET /: Home page. If the user is logged in, redirect to /urls. Otherwise, redirect to /login.
GET /urls: Display a list of shortened URLs created by the user. If the user is not logged in, show an error message.
GET /urls/new: Show a form for creating a new shortened URL. If the user is not logged in, redirect to /login.
GET /urls/:id: Show details of a specific shortened URL. If the user is not logged in or does not own the URL, show an error message.
GET /u/:id: Redirect to the original (long) URL for the given shortened URL ID.
POST /urls: Create a new shortened URL. If the user is not logged in, show an error message.
POST /urls/:id: Update the long URL for a specific shortened URL. If the user is not logged in or does not own the URL, show an error message.
POST /urls/:id/delete: Delete a specific shortened URL. If the user is not logged in or does not own the URL, show an error message.
GET /login: Show the login form. If the user is already logged in, redirect to /urls.
POST /login: Log in the user with the provided email and password. If the credentials are invalid, show an error message.
GET /register: Show the registration form. If the user is already logged in, redirect to /urls.
POST /register: Create a new user account. If the email is already registered or the fields are empty, show an error message.
POST /logout: Log out the user and redirect to /login.
