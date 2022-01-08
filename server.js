const express = require('express');
const nunjucks = require('nunjucks');
var app = express();
const PORT = '8000';

nunjucks.configure('views', {
  autoescape: true,
  express: app
});

app.set('view engine', 'html');

app.get('/', (req, res) => {
  res.render('index.html', { username: 'Bishal' })
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}...`)
});