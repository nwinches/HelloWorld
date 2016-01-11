module.exports = function(app){
  var queries = require('./queries');

  app.get('/', function (request, response) {
    response.render('index',
      { title : 'Home' }
    )
  });

  app.get('/destinations', function (request, response) {
    queries.getDestinations(function(err, table) {
      if (err) { 
        console.error(err);
        response.send("Error " + err);
      } else {
        response.render('destinations', {
          results: table
        });
      }
    });
  });

  app.get('/destinations/:destination_id', function (request, response) {
    queries.getDestination(request.params.destination_id, function(err, destination) {
      if (err) {
        console.error(err);
        response.send("Error " + err);
      } else {
        response.render('destination', {
          destination: destination
        });
      }
    });
  });

}
