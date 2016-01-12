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
          title: 'Destinations',
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
        console.log('in routes ' + JSON.stringify(destination, null, 2)); 
        response.render('destination', {
          title: 'destination.destination_name',
          destination: destination
        });
      }
    });
  });

  app.get('/countries', function (request, response) {
    queries.getCountries(function(err, table) {
      if (err) { 
        console.error(err);
        response.send("Error " + err);
      } else {
        response.render('countries', {
          title: 'Countries',
          results: table
        });
      }
    });
  });

  app.get('/countries/:country_code', function (request, response) {
    queries.getCountry(request.params.country_code, function(err, country) {
      if (err) {
        console.error(err);
        response.send("Error " + err);
      } else {
        response.render('country', {
          title: 'country.country_name',
          country: country
        });
      }
    });
  });

}
