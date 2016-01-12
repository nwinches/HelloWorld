module.exports = {

  // Destinations
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
  },
  

  // Countries
  getCountries: function(callback) {  
    var pg = require('pg');
    var dbUrl = process.env.DATABASE_URL;

    var queryString = 'select country_name, iso_country_code_two_letter as country_code, iso_country_code_three_letter, \
                              capital, currency_code, destination_id, destination_name, min_days, max_days, \
                              sum(min_days) over (partition by country_code) as sum_min_days, \
                              sum(max_days) over (partition by country_code) as sum_max_days \
                         from test_table \
                              left outer join destinations on (test_table.iso_country_code_two_letter = destinations.country_code)';

    pg.connect(dbUrl, function(err, client, done) {
      client.query(queryString, function(err, results) {
        done();
        
        var table = new Array;
        var i;
        for (i = 0; i < results.rows.length; i++) {
          var result = results.rows[i];
          var entry = new Object();

          if (table[result['country_code']]) {
            entry = table[result['country_code']];
          } else {
            table[result['country_code']] = entry;
            entry.country_code = result['country_code'];
            entry.country_name = result['country_name'];
            entry.iso_country_code_three_letter = result['iso_country_code_three_letter'];
            entry.capital = result['capital'];
            entry.currency_code = result['currency_code'];
            entry.min_days = result['sum_min_days'];
            entry.max_days = result['sum_max_days'];
            
            entry.destinations = new Array;
          }
          if (result['destination_id'] != '') {
            destination = new Object();
            entry.destinations[entry.destinations.length] = destination;
            destination.destination_id = result['destination_id'];
            destination.destination_name = result['destination_name'];
            destination.min_days = result['min_days'];
            destination.max_days = result['max_days'];
          }
        }

        callback(err, table);
      });
    });
  },

  getCountry: function(country_code, callback) {
    var pg = require('pg');
    var dbUrl = process.env.DATABASE_URL;

    var queryString = 'select country_name, iso_country_code_two_letter as country_code, iso_country_code_three_letter, \
                              capital, currency_code, destination_id, destination_name, min_days, max_days, \
                              sum(min_days) over (partition by country_code) as sum_min_days, \
                              sum(max_days) over (partition by country_code) as sum_max_days \
                         from test_table \
                              left outer join destinations on (test_table.iso_country_code_two_letter = destinations.country_code)';


    pg.connect(dbUrl, function(err, client, done) {
      client.query({text: queryString, values: [destination_id]}, function(err, results) {
        done();

        var table = new Array;
        var i;
        var entry = new Object();
        entry.destinations = new Array;

        for (i = 0; i < results.rows.length; i++) {
          var result = results.rows[i];

          entry.country_code = result['country_code'];
          entry.country_name = result['country_name'];
          entry.iso_country_code_three_letter = result['iso_country_code_three_letter'];
          entry.capital = result['capital'];
          entry.currency_code = result['currency_code'];
          entry.min_days = result['sum_min_days'];
          entry.max_days = result['sum_max_days'];
          
          if (result.destination_id !== '') {
            destination = new Object();
            entry.destinations[entry.destinations.length] = destination;
            destination.destination_id = result['destination_id'];
            destination.destination_name = result['destination_name'];
            destination.min_days = result['min_days'];
            destination.max_days = result['max_days'];
          }
        }

        callback(err, entry);
      });
    });
  }

}
