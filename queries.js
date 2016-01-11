module.exports = {

  getDestinations: function(callback) {  
    var pg = require('pg');
    var dbUrl = process.env.DATABASE_URL;
    console.error("connecting to: " + dbUrl);
    
    pg.connect(dbUrl, function(err, client, done) {
      client.query('SELECT * FROM test_table', function(err, result) {
        done();
        callback(err, result);
      });
    });
  }

}
