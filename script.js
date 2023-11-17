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

function getBreweries(city) {
getTicketMasterEventsAPI(city)
    .then(informationFromTicketMaster => venueToBreweriesAPI(informationFromTicketMaster._embedded.events[0]._embedded.venues[0].location))
    .catch(error => console.log("Error in the sequence of API calls: ", error));
}

getBreweries('Houston'); // example

//start of calendar functionality

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
    for (let i = 0; i < 10; i++) { // may need to use 10 instead. Why does inputListOfEvents.length not work?
            //var fedLocation = inputListOfEvents[i];
            // console.log(inputListOfEvents[i]._embedded.venues); // Mimic Michael's picture he sent you
            console.log(inputListOfEvents[i]);
            var reqURL = 'https://api.openbrewerydb.org/v1/breweries?by_dist='+ inputListOfEvents[i]._embedded.venues[0].location.latitude + ',' + inputListOfEvents[i]._embedded.venues[0].location.longitude + '&per_page=3';

            var request = fetch(reqURL)
            .then(function(res){
                return {breweryData: res.json(), eventInfoTwo: inputListOfEvents[i]};
            });//venueToBreweriesAPI(inputListOfEvents[i]._embedded.venues[0].location); // Uncaught TypeError: Cannot read properties of undefined (reading '0') // Ask Michael/Nirav
            requests.push(request);
    }

    Promise.all(requests)
    .then(function (results) {

        console.log(results);
        // DOM appending
        results.forEach(function(result) {
            // Extract concert event info
            var concertName = result.eventInfoTwo.name;
            var concertDate = result.eventInfoTwo.dates.start.localDate;

            // Create and append heading to DOM
            var concertHeading = document.createElement('h2');
            concertHeading.textContent = 'Concert: ' + concertName + ', Date: ' + concertDate;
            venueBreweriesRecs.appendChild(concertHeading);

            // List a few breweries for each
            results.forEach(function(breweryData) {
                var breweryName = result.breweryData.PromiseResults.name;
                //var breweryAddress = result.breweryData.street + ', ' + result.breweryData.city + ', ' + result.breweryData.state + ' ' + result.breweryData.postal_code;

                // Create a new paragraph element to display brewery information
                var breweryInfo = document.createElement('p');
                breweryInfo.textContent = 'Brewery Name: ' + breweryName; //+ ', Address: ' + breweryAddress;
                
                // Append the paragraph element to the DOM
                venueBreweriesRecs.appendChild(breweryInfo);
            });
        });
    })
    .catch(function (error) {
        console.error("Error fetching data: ", error);
    })

    };
    
    


//[7]._embedded.venues[0]
// [0]._embedded.venues[0].location.latitude

//returnThreeBreweriesForEventVenues('Los Angeles');
    


showTopTenVenues("Los Angeles");

//returnThreeBreweriesForEventVenues();

var date;
$( function() {
    var dateFormat = "mm/dd/yy",
      from = $( "#from" )
        .datepicker({
          defaultDate: "+1w",
          changeMonth: true,
          numberOfMonths: 1
        })
        .on( "change", function() {
          to.datepicker( "option", "minDate", getDate( this ) );
        }),
      to = $( "#to" ).datepicker({
        defaultDate: "+1w",
        changeMonth: true,
        numberOfMonths: 1
      })
      .on( "change", function() {
        from.datepicker( "option", "maxDate", getDate( this ) );
      });
 
    function getDate( element ) {
      try {
        date = $.datepicker.parseDate( dateFormat, element.value );
      } catch( error ) {
        date = null;
      }
      console.log(date);
      return date;
    }
  } );

  
  
var genreApi = '';

var checkboxEl = document.getElementById('checkbox');

 checkboxEl.addEventListener('click', function(event) {
var targetEl = (event.target);
targetEl.value = 'yes';
var targetElText = targetEl.attributes.id.textContent + ', ';

if (targetEl.value === 'yes') {
  genreApi += targetElText;

  targetEl.addEventListener('click', function(event) {
    event.target.value = 'no';
      genreApi -= event.target.attributes.id.textContent;
  });
}




console.log(genreApi);
 });


