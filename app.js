// dependencies
var express = require('express');
var stylus = require('stylus');
var nib = require('nib');
var pg = require('pg');


var app = express()

// create a custom function for stylus to proxy to nib
function compile(str, path) {
  return stylus(str)
    .set('filename', path)
    .use(nib())
}

// Tell Express to use the Jade template engine, and point to the views dir
app.set('views', __dirname + '/views')
app.set('view engine', 'jade')

// Effectively a handler chain.  First log the requests in dev mode, then pass to Stylus
app.use(express.logger('dev'))
app.use(stylus.middleware(
  { src: __dirname + '/public'
  , compile: compile
  }
))
app.use(express.static(__dirname + '/public'))



// Routes
app.get('/', function (req, res) {
  res.render('index',
    { title : 'Home' }
  )
})

app.get('/db', function (request, response) {
  var dbUrl = process.env.DATABASE_URL;
  console.error("connecting to: " + dbUrl);
  pg.connect(dbUrl, function(err, client, done) {
    if (err) {
      console.error(err);
      response.send("Error " + err);
    }
    client.query('SELECT * FROM test_table', function(err, result) {
      done();
      if (err)
       { console.error(err); response.send("Error " + err); }
      else
       { response.render('db', {results: result.rows} ); }
    });
  });
})



app.set('port', (process.env.PORT || 3000));
app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
})

