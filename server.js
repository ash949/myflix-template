const express = require('express'),
  morgan = require('morgan');

const app = express();

app.use(morgan('common'));

app.use(express.static('public'));

app.get('/', function (req, res) {
  res.send('Welcome to my app!');
});
app.get('/secreturl', function (req, res) {
  res.send('This is a secret url with super top-secret content.');
});

app.use(function (err, req, res, next) {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

app.listen(8080);