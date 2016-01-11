module.exports = {

  getDestinations: function(callback) {  
    var pg = require('pg');
    var dbUrl = process.env.DATABASE_URL;

    var queryString = 'select destination_id, destination_name, country_name, min_days, max_days, activity_name, description \
                         from destinations \
                              inner join test_table on (destinations.country_code = test_table.iso_country_code_two_letter) \
                              left outer join destination_activity using (destination_id) \
                              left outer join activities using (activity_id)';

    pg.connect(dbUrl, function(err, client, done) {
      client.query(queryString, function(err, results) {
        done();
        
        var table = new Array;
        var i;
        for (i = 0; i < results.rows.length; i++) {
          var result = results.rows[i];
          var entry = new Object();

          if (table[result['destination_id']]) {
            entry = table[result['destination_id']];
          } else {
            table[result['destination_id']] = entry;
            entry.destination_id = result['destination_id'];
            entry.destination_name = result['destination_name'];
            entry.country_name = result['country_name'];
            entry.min_days = result['min_days'];
            entry.max_days = result['max_days'];
            entry.activity_name = new Array;
            entry.description = new Array;
          }
          if (result['activity_name'] != '') {
            entry.activity_name[entry.activity_name.length] = result['activity_name'];
          }
          if (result['description'] != '') {
            entry.description[entry.description.length] = result['description'];
          }
        }

        callback(err, table);
      });
    });
  },

  getDestination: function(destination_id, callback) {
    var pg = require('pg');
    var dbUrl = process.env.DATABASE_URL;

    var queryString = 'select destination_id, destination_name, country_name, min_days, max_days, activity_name, description \
                         from destinations \
                              inner join test_table on (destinations.country_code = test_table.iso_country_code_two_letter) \
                              left outer join destination_activity using (destination_id) \
                              left outer join activities using (activity_id) \
                        where destinations.destination_id = $1 ';

    pg.connect(dbUrl, function(err, client, done) {
      client.query({text: queryString, values: [destination_id]}, function(err, results) {
        done();

        console.log('destination' + JSON.stringify(results, null, 2));

        var table = new Array;
        var i;
        var entry = new Object();
        entry.activity_name = new Array;
        entry.description = new Array;

        for (i = 0; i < results.rows.length; i++) {
          var result = results.rows[i];

          entry.destination_id = result['destination_id'];
          entry.destination_name = result['destination_name'];
          entry.country_name = result['country_name'];
          entry.min_days = result['min_days'];
          entry.max_days = result['max_days'];
          
          if (result['activity_name'] != '') {
            entry.activity_name[entry.activity_name.length] = result['activity_name'];
          }
          if (result['description'] != '') {
            entry.description[entry.description.length] = result['description'];
          }
        }

        callback(err, entry);
      });
    });
  }

}
