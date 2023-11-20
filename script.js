// DOM variable definition
var submitButton = document.getElementById("search-button");
var inputCity = document.getElementById("ticketmaster-search");
var venueBreweriesRecs = document.getElementById("brewery-search-container");
var eventsEl = document.getElementById('ticketmaster-api-results-container')
var breweryListEl = document.getElementById('brewery-api-results-container')

submitButton.addEventListener("click", function(event) {
    event.preventDefault();
    var searchedCity = inputCity.value.trim();

    console.log("Search button clicked for city: ", searchedCity);
    showTopTenVenues(searchedCity);
})

// TicketMaster API Set-up
function getTicketMasterEventsAPI(city="San Diego", keyWord='Music', radius=50) { 
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
            return data;
        });
}


//largest function
//stores ticketmaster api data into listofevents var
var listOfEvents = [];

function showTopTenVenues (searchedCity) {
    listOfEvents = []; // reset so that each new search can use the code with newly initialized variables
    breweryList = []; // reset so that each new search can use the code with newly initialized variables
    argums = { venueLat: '', venueLon: ''}; // reset so that each new search can use the code with newly initialized variables
    eventsEl.innerHTML = ''; // added to fix issue similar to repeated brewery appending
    getTicketMasterEventsAPI(searchedCity)
      .then(function (response) {
        for (var i = 0; listOfEvents.length < 10; i++) { 
          
            if (!listOfEvents.includes(response._embedded.events[i].name)) {
                listOfEvents.push(response._embedded.events[i])};
                //as it loops through ticketmaster events grabs each long and lat and plugs into arguments for brewery api
                argums.venueLat = listOfEvents[i]._embedded.venues[0].location.latitude;
                argums.venueLon = listOfEvents[i]._embedded.venues[0].location.longitude; 

                //calls brewery api once per event, not super effecient but it works, total brewery array will
                //be filled with same amount of objects matching the i variable in loop
                venueToBreweriesAPI();

                  //start of DOM appendage
            var concertName = listOfEvents[i].name;
            var concertDate = listOfEvents[i].dates.start.localDate;
            //set results to button to listen for click events
            var concertHeading = document.createElement('button');
            //set an id to track what number the result was in the for loop
            concertHeading.setAttribute('id', i);
            var concertList = document.createElement('ol');
            var concertListItem = document.createElement('li');
            concertHeading.textContent ='Concert: ' + concertName + ', Date: ' + concertDate;
            concertListItem.appendChild(concertHeading);
            concertList.appendChild(concertListItem);
            eventsEl.appendChild(concertList);


              //event listener for which concert is clicked
            concertHeading.addEventListener('click', function(event){
              // placeholder name for variable n grabs which the id which was assigned to 
              //each concert list item and will pair the options given with an array from the brewery api call
              var n = event.target.attributes.id.value;

              var clickCounter = 0;
              clickCounter++;

              
              console.log(n);
              //DOM appendage for brewery Api results
              
              if (clickCounter === 1) {
                breweryListEl.innerHTML = ''; // clears previous breweries displayed upon different event clicks
              for (r = 0; r <=3; r++) {
                 var breweryName = document.createElement('h2');
                  breweryName.textContent = breweryList[n][r].name;
                  breweryListEl.appendChild(breweryName);
                  clickCounter = 0;
              }
             } else if(clickCounter === 0) {
              
              for (r = 0; r <= 3; r++) {
                breweryName.textContent = breweryList[n][r].name;
              }
              clickCounter += 1;
              }
            
            
          })
        }
              console.log(listOfEvents);
            })
      };


      //declared arguments outside of scope for long and lat so they can be called during ticketmaster api fetch
    var argums = {venueLat: '', venueLon:''};

  // breweryList holds all the arrays from brewery api call
      var breweryList = [];
        function venueToBreweriesAPI() {
          var pregameURL = 'https://api.openbrewerydb.org/v1/breweries?by_dist=' + 
            argums.venueLat + ',' +
             argums.venueLon + 
            '&per_page=3';

       return fetch(pregameURL)
        .then(function (response){
            return response.json();
        })
        .then(function (data){
          breweryList.push(data);
            //console.log(data)
            console.log(breweryList);
        });
}

//start of calendar functionality
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

//start of checkbox functionality
var genreApi = [];

var checkboxEl = document.getElementById('checkbox');

 checkboxEl.addEventListener('click', function(event) {
var targetEl = (event.target);
//targetEl.value = 'yes';
var targetElText = targetEl.attributes.id.textContent;
var index = genreApi.indexOf(targetElText);

if (targetEl.value === 'no') {
  genreApi.push(targetElText);
  targetEl.value = 'yes';
} else if (targetEl.value === 'yes') {
    console.log(index);
    genreApi.splice(index, 1);
    targetEl.value = 'no';
}

//genre codes
//"KnvZfZ7vAvt" Metal
//"KnvZfZ7vAeA" Rock
//"KnvZfZ7vAev" Pop



console.log(genreApi);
 });

 
