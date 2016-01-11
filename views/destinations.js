extend layout
block content
  p
    | Destinations!
  table.sortable
    thead
      th Name
      th Country
      th Days
      th Activites
      th Description
    each result, index in results.length ? results : ['There are no destinations :(']
      - console.log('starting: ' + JSON.stringify(result, null, 2));
      if index > 0
        tr
          td= #[a(href="/destinations/"+result.destination_id) result.destination_name]
          td= result.country_name
          td= result.min_days + '-' + result.max_days
          td
            ul
              each activity in result.activity_name.length ? result.activity_name : [null]
                if activity
                  li= activity
          td
            ul
              each desc in result.description.length ? result.description : [null]
                if desc
                  li= desc
block sidebar

