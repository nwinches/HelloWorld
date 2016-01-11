module.exports = function(app){

  app.get('/', function (request, response) {
    response.render('index',
      { title : 'Home' }
    )
  })

  app.get('/db', function (request, response) {
    var queries = require('./queries');

    queries.getDestinations(function(err, result) {
      console.log('got results: ' + JSON.stringify(result, null, 4));

      if (err) { 
        console.error(err);
        response.send("Error " + err);
      } else {
        response.render('db', {
          results: result
        });
      }
    });
  });

}
