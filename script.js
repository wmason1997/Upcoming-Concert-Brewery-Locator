// DOM variable definition
var submitButton = document.getElementById("search-button");
var inputCity = document.getElementById("ticketmaster-search");
var venueBreweriesRecs = document.getElementById("brewery-search-container");

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

getTicketMasterEventsAPI(city = "Boston", keyWord="rap");

// second
function venueToBreweriesAPI(informationFromTicketMaster) {
    var argums = {venueLat: informationFromTicketMaster.latitude, venueLon: informationFromTicketMaster.longitude};
    var pregameURL = 'https://api.openbrewerydb.org/v1/breweries?by_dist=' + 
    argums.venueLat + ',' +
    argums.venueLon + 
    'per_page=3';

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
// import DateRangePicker from 'flowbite-datepicker/DateRangePicker';
// const dateRangePickerEl = document.getElementById('#datepicker');
// new DateRangePicker(dateRangePickerEl, {

// });

function showTopTenVenues (city) {
    getTicketMasterEventsAPI(city)
    .then(function (response) {
        var listOfEvents = [];
        for (var i = 0; listOfEvents.length < 10; i++) { // number of events right now is 5
            if (!listOfEvents.includes(response._embedded.events[i].name)) {
                listOfEvents.push(response._embedded.events[i]); // could take off the .name here. then would have the 5 data objects to manipulate
                
            }
            // console.log("show top venues", response._embedded.events[i]);
        }
        console.log(listOfEvents);
        console.log(listOfEvents[0]._embedded.venues[0].location);
        // return listOfEvents;
        returnThreeBreweriesForEventVenues(listOfEvents);
    })
}

var exampleTen = showTopTenVenues("Los Angeles");

function returnThreeBreweriesForEventVenues (inputListOfEvents) {
    // for loop for the ten breweries
    var exampleOutput = [];
    var requests = []; // to allow for promise.all later
    for (var i = 0; i < 10; i++) { // may need to use 10 instead. Why does inputListOfEvents.length not work?
            //var fedLocation = inputListOfEvents[i];
            // console.log(inputListOfEvents[i]._embedded.venues); // Mimic Michael's picture he sent you
            console.log(inputListOfEvents[i]);
            var reqURL = 'https://api.openbrewerydb.org/v1/breweries?by_dist='+ inputListOfEvents[i]._embedded.venues[0].location.latitude + ',' + inputListOfEvents[i]._embedded.venues[0].location.longitude + '&per_page=3';

            var request = fetch(reqURL)
            .then(function(res){
                return res.json();
            });//venueToBreweriesAPI(inputListOfEvents[i]._embedded.venues[0].location); // Uncaught TypeError: Cannot read properties of undefined (reading '0') // Ask Michael/Nirav
            requests.push(request);
    }

    Promise.all(requests)
    .then(function (results) {
        console.log(results);

        // DOM appending
    });
    
    
}

//[7]._embedded.venues[0]
// [0]._embedded.venues[0].location.latitude

//returnThreeBreweriesForEventVenues('Los Angeles');

showTopTenVenues("Los Angeles");

//returnThreeBreweriesForEventVenues();

