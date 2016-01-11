module.exports = {

  getDestinations: function(callback) {  
    var pg = require('pg');
    var dbUrl = process.env.DATABASE_URL;
    console.error("connecting to: " + dbUrl);

    var queryString = 'select destination_id, destination_name, country_code, min_days, max_days, activity_name, description \
                         from destinations \
                              left outer join destination_activity using (destination_id) \
                              left outer join activities using (activity_id)';

    pg.connect(dbUrl, function(err, client, done) {
      client.query(queryString, function(err, results) {
        done();
        
        var table = [];
        var i;
        for (int i = 0; i < results.rows.length; i++) {
          var result = results.rows[i];
          console.log(JSON.stringify(result, null, 4));
          if (!table[result.destination_id]) {
            table[result.destination_id] = [];
          }
          table[result.destination_id].destination_name = result.destination_name;
          table[result.destination_id].country_code = result.country_code;
          table[result.destination_id].min_days = result.min_days;
          table[result.destination_id].max_days = result.max_days;
          
          if (!table[result.destination_id].activity_name) {
            table[result.destination_id].activity_name = new Array;
            table[result.destination_id].description = new Array;
          }
          if (result.activity_name != '') {
            table[result.destination_id].activity_name[table[result.destination_id].activity_name.length] = result.activity_name;
          }
          if (result.description != '') {
            table[result.destination_id].description[table[result.destination_id].description.length] = result.description;
          }
        }

        callback(err, table);
      });
    });
  }

}
