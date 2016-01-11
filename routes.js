module.exports = function(app){

  app.get('/', function (request, response) {
    response.render('index',
      { title : 'Home' }
    )
  })

  app.get('/db', function (request, response) {
    var queries = require('./queries');

    queries.getDestinations(function(err, table) {
      if (err) { 
        console.error(err);
        response.send("Error " + err);
      } else {
        response.render('db', {
          results: table
        });
      }
    });
  });

}
