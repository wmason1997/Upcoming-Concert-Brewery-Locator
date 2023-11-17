// DOM variable definition
var submitButton = document.getElementById("search-button");
var inputCity = document.getElementById("ticketmaster-search");

submitButton.addEventListener("click", function(event) {
    event.preventDefault();
    var searchedCity = inputCity.value.trim();

    getBreweries(searchedCity);
})

// TicketMaster API Set-up

// first
function getTicketMasterEventsAPI(city="San Diego", keyWord='rock', radius=50) { 
    var requestURL = 'https://app.ticketmaster.com/discovery/v2/events.json?'  + 
    'keyword='+ keyWord +
    // '&postalCode='+ postalCode + 
    '&city=' + city + 
    '&radius=' +radius+
    '&unit=miles' + 
    '&size=100' +
    '&apikey=Wy4kfV2CuBeyHrZmzpbvUf5VYbT9wXmJ';

    return fetch(requestURL)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            // console.log(data);
            console.log(data._embedded.events[0]._embedded.venues[0].location); // the index i would be the first zero here
            // console.log(data._embedded.events[0]._embedded.venues[0].location.longitude);
            // console.log(data._embedded.events[0]._embedded.venues[0].location.latitude);
            return data;
        });
}

getTicketMasterEventsAPI();

// getTicketMasterEventsAPI("Los Angeles", "Pop");

// second
function venueToBreweriesAPI(informationFromTicketMaster) {
    var arguments = {venueLat: informationFromTicketMaster.latitude, venueLon: informationFromTicketMaster.longitude};
    var pregameURL = 'https://api.openbrewerydb.org/v1/breweries?by_dist=' + 
    arguments.venueLat + ',' +
    arguments.venueLon + 
    'per_page=5';

    return fetch(pregameURL)
        .then(function (response){
            return response.json();
        })
        .then(function (data){
            console.log(data)
        });
}

// The sequence of the calls chained
// function combinedAPIcall = 

function getBreweries(city) {
getTicketMasterEventsAPI(city)
    .then(informationFromTicketMaster => venueToBreweriesAPI(informationFromTicketMaster._embedded.events[0]._embedded.venues[0].location))
    .catch(error => console.log("Error in the sequence of API calls: ", error));
}

getBreweries('Houston'); // example




//start of calendar functionality
