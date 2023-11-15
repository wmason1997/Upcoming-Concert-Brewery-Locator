// https://www.openbrewerydb.org/documentation

// lat long in example was 38.8977,77.0365

function venueToBreweriesAPI(venueLat, venueLon) {
    var pregameURL = 'https://api.openbrewerydb.org/v1/breweries?by_dist=' + 
    venueLat + ',' +
    venueLon + 
    'per_page=5';

    fetch(pregameURL)
        .then(function (response){
            return response.json();
        })
        .then(function (data){
            console.log(data)
        });
}

venueToBreweriesAPI(38.8977,77.0365); // returns the same first three as on the by_dist example on the documentation page above

// for the observatory
venueToBreweriesAPI(32.748097, -117.131213);