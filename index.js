
let express = require('express');
let app = express();

// middleware
app.use('/public', express.static('public'));
app.set('view engine', 'pug');

// respond with "hello world" when a GET request is made to the homepage
app.get('/', function (req, res) {
  res.render('index', { title: 'Hey', message: 'Hello there!' })
});

app.get('/translate', function (req, res) {
  res.render('translate', { title: 'Hey', message: 'Hello there!' })
});

app.listen(3000, () => console.log('Example app listening on port 3000!'));
