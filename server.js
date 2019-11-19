const express = require('express'),
  morgan = require('morgan'),
  bodyParser = require("body-parser"),
  mongoose = require('mongoose'),
  passport = require('passport'),
  cors = require('cors');
const { check, validationResult } = require('express-validator');


/*==========================*/
/*       APP SETUP          */
/*==========================*/

const Models = require('./models.js');
const Movies = Models.Movie;
const Users = Models.User;
mongoose.connect('mongodb://localhost:27017/myFlixDB', { useNewUrlParser: true });

const app = express();
app.use(bodyParser.json());
app.use(morgan('common'));
app.use(express.static('public'));
var auth = require('./auth')(app);
require('./passport');
app.use(cors());


/*==========================*/
/*          ROUTES          */
/*==========================*/

// Welcome endpoint
app.get('/', function (req, res) {
  res.send('Welcome to my app!');
});


// Return a list of ALL movies to the user
app.get("/movies", function (req, res) {
  // app.get("/movies", passport.authenticate('jwt', { session: false }), function (req, res) {
  Movies.find()
    .then(function (movies) {
      res.status(201).json(movies);
    }).catch(function (error) {
      console.error(error);
      res.status(500).send("Error: " + error);
    });
});

// Return data (description, genre, director, image URL, whether it’s featured or not) about a single movie by title to the user
app.get('/movies/:title', passport.authenticate('jwt', { session: false }), function (req, res) {
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
app.get('/users', passport.authenticate('jwt', { session: false }), function (req, res) {

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
app.get('/users/:Username', passport.authenticate('jwt', { session: false }), function (req, res) {
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
app.post('/users',
  // Validation logic here for request
  //you can either use a chain of methods like .not().isEmpty()
  //which means "opposite of isEmpty" in plain english "is not empty"
  //or use .isLength({min: 5}) which means
  //minimum value of 5 characters are only allowed
  [check('Username', 'Username is required').isLength({ min: 5 }),
  check('Username', 'Username contains non alphanumeric characters - not allowed.').isAlphanumeric(),
  check('Password', 'Password is required').not().isEmpty(),
  check('Email', 'Email does not appear to be valid').isEmail()], (req, res) => {

    // check the validation object for errors
    var errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    var hashedPassword = Users.hashPassword(req.body.Password);
    Users.findOne({ Username: req.body.Username }) // Search to see if a user with the requested username already exists
      .then(function (user) {
        if (user) {
          //If the user is found, send a response that it already exists
          return res.status(400).send(req.body.Username + " already exists");
        } else {
          Users
            .create({
              Username: req.body.Username,
              Password: hashedPassword,
              Email: req.body.Email,
              Birthday: req.body.Birthday
            })
            .then(function (user) { res.status(201).json(user) })
            .catch(function (error) {
              console.error(error);
              res.status(500).send("Error: " + error);
            });
        }
      }).catch(function (error) {
        console.error(error);
        res.status(500).send("Error: " + error);
      });
  });

// Allow users to update their user info (username, password, email, date of birth)
app.put('/users/:Username', passport.authenticate('jwt', { session: false }), function (req, res) {
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
app.post('/users/:Username/Movies/:MovieID', passport.authenticate('jwt', { session: false }), function (req, res) {
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
app.delete('/users/:Username/Movies/:MovieID', passport.authenticate('jwt', { session: false }), function (req, res) {
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
app.delete('/users/:Username', passport.authenticate('jwt', { session: false }), function (req, res) {
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