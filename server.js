const express = require('express'),
  morgan = require('morgan'),
  bodyParser = require("body-parser");

const app = express();

app.use(bodyParser.json());
app.use(morgan('common'));
app.use(express.static('public'));

// Welcome endpoint
app.get('/', function (req, res) {
  res.send('Welcome to my app!');
});

// Return a list of ALL movies to the user
app.get('/movies', (req, res) => {
  res.send('/movies');
});

// Return data (description, genre, director, image URL, whether it’s featured or not) about a single movie by title to the user
app.get('/movies/:id', (req, res) => {
  res.send(`GET /movies/${req.params.id}`);
});

// Return data about a genre (description) by name/title (e.g., “Thriller”)
app.get('/genres/:id', (req, res) => {
  res.send(`GET /genres/${req.params.id}`);
});

// Return data about a director (bio, birth year, death year) by name
app.get('/directors/:id', (req, res) => {
  res.send(`GET /directors/${req.params.id}`);
});

// Allow new users to register
app.post('/users', (req, res) => {
  res.send('POST /users');
});

// Allow users to update their user info (username, password, email, date of birth)
app.put('/users/:id', (req, res) => {
  res.send(`PUT /users/${req.params.id}`);
});

// Allow users to add a movie to their list of favorites
app.post('/users/:user_id/favorite_movies/:movie_id', (req, res) => {
  res.send(`POST /users/${req.params.user_id}/favorite_movies/${req.params.movie_id}`);
});


// Allow users to remove a movie from their list of favorites
app.delete('/users/:user_id/favorite_movies/:movie_id', (req, res) => {
  res.send(`DELETE /users/${req.params.user_id}/favorite_movies/${req.params.movie_id}`);
});

// Allow existing users to deregister
app.delete('/users/:id', (req, res) => {
  res.send(`DELETE /users/${req.params.id}`);
});

app.use(function (err, req, res, next) {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

app.listen(8080);