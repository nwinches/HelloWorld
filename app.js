
// dependencies
var express = require('express')
  , stylus = require('stylus')
  , nib = require('nib')

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

app.get('/', function (req, res) {
  res.render('index',
    { title : 'Home' }
  )
})
app.listen(3000)

