const express = require('express'),
  morgan = require('morgan'),
  bodyParser = require("body-parser"),
  mongoose = require('mongoose');



/*==========================*/
/*      DATABASE SETUP      */
/*==========================*/

const Models = require('./models.js');
const Movies = Models.Movie;
const Users = Models.User;

// localhost
const DB_NAME = 'myFlixDB'
const DB_HOST_URL = 'mongodb://localhost:27017'

mongoose.connect(`${DB_HOST_URL}/${DB_NAME}`, { useNewUrlParser: true });

/*==========================*/
/*       APP SETUP          */
/*==========================*/

const app = express();
app.use(bodyParser.json());
app.use(morgan('common'));
app.use(express.static('public'));


/*==========================*/
/*          ROUTES          */
/*==========================*/

// Welcome endpoint
app.get('/', function (req, res) {
  res.send('Welcome to my app!');
});


// Return a list of ALL movies to the user
app.get('/movies', function (req, res) {

  Movies.find()
    .then(function (movies) {
      res.status(201).json(movies)
    })
    .catch(function (err) {
      console.error(err);
      res.status(500).send("Error: " + err);
    });
});

// Return data (description, genre, director, image URL, whether it’s featured or not) about a single movie by title to the user
app.get('/movies/:title', function (req, res) {
  Users.findOne({ Username: req.params.title })
    .then(function (movie) {
      res.json(movie)
    })
    .catch(function (err) {
      console.error(err);
      res.status(500).send("Error: " + err);
    });
});

// Get all users
app.get('/users', function (req, res) {

  Users.find()
    .then(function (users) {
      res.status(201).json(users)
    })
    .catch(function (err) {
      console.error(err);
      res.status(500).send("Error: " + err);
    });
});

// Get user's info by username
app.get('/users/:Username', function (req, res) {
  Users.findOne({ Username: req.params.Username })
    .then(function (user) {
      res.json(user)
    })
    .catch(function (err) {
      console.error(err);
      res.status(500).send("Error: " + err);
    });
});

// Allow new users to register
app.post('/users', function (req, res) {
  Users.findOne({ Username: req.body.Username })
    .then(function (user) {
      if (user) {
        return res.status(400).send(req.body.Username + "already exists");
      } else {
        Users
          .create({
            Username: req.body.Username,
            Password: req.body.Password,
            Email: req.body.Email,
            Birthday: req.body.Birthday
          })
          .then(function (user) { res.status(201).json(user) })
          .catch(function (error) {
            console.error(error);
            res.status(500).send("Error: " + error);
          })
      }
    }).catch(function (error) {
      console.error(error);
      res.status(500).send("Error: " + error);
    });
});

// Allow users to update their user info (username, password, email, date of birth)
app.put('/users/:Username', function (req, res) {
  Users.findOneAndUpdate({ Username: req.params.Username }, {
    $set:
    {
      Username: req.body.Username,
      Password: req.body.Password,
      Email: req.body.Email,
      Birthday: req.body.Birthday
    }
  },
    { new: true }, // This line makes sure that the updated document is returned
    function (err, updatedUser) {
      if (err) {
        console.error(err);
        res.status(500).send("Error: " + err);
      } else {
        res.json(updatedUser)
      }
    })
});

// Allow users to add a movie to their list of favorites
app.post('/users/:Username/Movies/:MovieID', function (req, res) {
  Users.findOneAndUpdate({ Username: req.params.Username }, {
    $push: { FavoriteMovies: req.params.MovieID }
  },
    { new: true }, // This line makes sure that the updated document is returned
    function (err, updatedUser) {
      if (err) {
        console.error(err);
        res.status(500).send("Error: " + err);
      } else {
        res.json(updatedUser)
      }
    })
});

// Allow users to remove a movie from their list of favorites
app.delete('/users/:Username/Movies/:MovieID', function (req, res) {
  Users.findOneAndUpdate({ Username: req.params.Username }, {
    $pull: { FavoriteMovies: req.params.MovieID }
  },
    { new: true }, // This line makes sure that the updated document is returned
    function (err, updatedUser) {
      if (err) {
        console.error(err);
        res.status(500).send("Error: " + err);
      } else {
        res.json(updatedUser)
      }
    })
});

// Allow existing users to deregister
app.delete('/users/:Username', function (req, res) {
  Users.findOneAndRemove({ Username: req.params.Username })
    .then(function (user) {
      if (!user) {
        res.status(400).send(req.params.Username + " was not found");
      } else {
        res.status(200).send(req.params.Username + " was deleted.");
      }
    })
    .catch(function (err) {
      console.error(err);
      res.status(500).send("Error: " + err);
    });
});

app.use(function (err, req, res, next) {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

app.listen(8080);