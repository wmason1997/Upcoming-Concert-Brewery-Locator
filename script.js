// DOM variable definition
var submitButton = document.getElementById("search-button");
var inputCity = document.getElementById("ticketmaster-search");
var venueBreweriesRecs = document.getElementById("brewery-search-container");
var eventsEl = document.getElementById("ticketmaster-api-results-container");
var breweryListEl = document.getElementById("brewery-api-results-container");

var storedFrom = localStorage.getItem("storedFrom");
var storedTo = localStorage.getItem("storedTo");

// Store the currently searched city for brewery searches
var currentSearchedCity = "";

console.log("storedFrom: ", storedFrom);
console.log("storedTo:", storedTo);

var fromDateLocal = storedFrom ? new Date(storedFrom) : undefined;
var toDateLocal = storedTo ? new Date(storedTo) : undefined;

submitButton.addEventListener("click", function (event) {
  event.preventDefault();
  var searchedCity = inputCity.value.trim();

  console.log("Search button clicked for city: ", searchedCity);
  showTopTenVenues(searchedCity);
});

function getTicketMasterEventsAPI(
  city = "San Diego",
  desiredStartDate = "",
  desiredEndDate = "",
  classificationIds = genreString,
  radius = "20"
) {
  // Check if there is a date range specified
  var dateParams = "";
  if (desiredStartDate && desiredEndDate) { // if both a start and end are specified
    dateParams =
      "&startDateTime=" +
      encodeURIComponent(
        dayjs(desiredStartDate).format("YYYY-MM-DDTHH:mm:ss") + "Z"
      ) +
      "&endDateTime=" +
      encodeURIComponent(
        dayjs(desiredEndDate).format("YYYY-MM-DDTHH:mm:ss") + "Z"
      );
  } else if (desiredStartDate) { // only start date specified
    dateParams =
      "&startDateTime=" +
      encodeURIComponent(
        dayjs(desiredStartDate).format("YYYY-MM-DDTHH:mm:ss") + "Z"
      );
  } else if (desiredEndDate) { // only end date specified
    dateParams =
      "&endDateTime=" +
      encodeURIComponent(
        dayjs(desiredEndDate).format("YYYY-MM-DDTHH:mm:ss") + "Z"
      );
  }

  // Build genre filter parameter (comma-separated for OR operation)
  var genreParams = "";
  if (classificationIds) {
    genreParams = "&classificationId=" + classificationIds;
  }

  var requestURL =
    "https://app.ticketmaster.com/discovery/v2/events.json?" +
    "city=" +
    city +
    "&radius=" +
    radius +
    "&unit=miles" +
    "&size=100" +
    dateParams + // if no date specified this will be empty
    genreParams + // if no genres specified this will be empty
    "&apikey=Wy4kfV2CuBeyHrZmzpbvUf5VYbT9wXmJ";

  console.log("TicketMaster API URL:", requestURL);

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
    currentSearchedCity = searchedCity; // Store the city for brewery searches
    listOfEvents = []; // reset so that each new search can use the code with newly initialized variables
    breweryList = []; // reset so that each new search can use the code with newly initialized variables
    argums = { venueLat: '', venueLon: ''}; // reset so that each new search can use the code with newly initialized variables
    eventsEl.innerHTML = ''; // added to fix issue similar to repeated brewery appending

    // Hide brewery section when starting a new search
    var brewerySection = document.getElementById("brewery-search-container");
    if (brewerySection) {
      brewerySection.style.display = 'none';
    }
    getTicketMasterEventsAPI(city=searchedCity, desiredStartDate = localStorage.getItem('storedFrom'), desiredEndDate = localStorage.getItem('storedTo'))
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
      var concertHeading = document.createElement("button");
      //set an id to track what number the result was in the for loop
      concertHeading.setAttribute("id", i);
      //add CSS class for clickable styling
      concertHeading.className = "event-button";
      var concertList = document.createElement("ol");
      var concertListItem = document.createElement("li");
      concertHeading.textContent = concertName + " • " + concertDate;
      concertListItem.appendChild(concertHeading);
      concertList.appendChild(concertListItem);
      eventsEl.appendChild(concertList);

      //event listener for which concert is clicked
      concertHeading.addEventListener("click", function (event) {
        // placeholder name for variable n grabs which the id which was assigned to
        //each concert list item and will pair the options given with an array from the brewery api call
        var n = event.target.attributes.id.value;

        var clickCounter = 0;
        clickCounter++;

        // Update brewery header with concert name and date
        var selectedConcertName = listOfEvents[n].name;
        var selectedConcertDate = listOfEvents[n].dates.start.localDate;
        var breweryHeader = document.querySelector("#brewery-search-container h4");
        if (breweryHeader) {
          breweryHeader.innerHTML = "Breweries near " + selectedConcertName + " concert on " + selectedConcertDate + ":";
        }

        // Show brewery section
        var brewerySection = document.getElementById("brewery-search-container");
        if (brewerySection) {
          brewerySection.style.display = 'flex';
        }

        // Show brewery arrow immediately (before trying to display breweries)
        console.log("Event clicked, attempting to show brewery arrow");
        var breweryArrow = document.getElementById('scroll-arrow-breweries');
        console.log("Brewery arrow element:", breweryArrow);
        if (breweryArrow) {
          breweryArrow.style.display = 'flex';
          console.log("Brewery arrow display set to flex");
          // Auto-hide after 5 seconds
          setTimeout(function() {
            breweryArrow.style.display = 'none';
          }, 5000);
        } else {
          console.log("Brewery arrow element not found!");
        }

        // Auto-scroll to brewery section
        requestAnimationFrame(function() {
          setTimeout(function() {
            if (brewerySection) {
              brewerySection.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
          }, 200);
        });

        //console.log(n);
        //DOM appendage for brewery Api results
        //need to edit this block below played around with some dom appendage to try and remove first results
        //but its 6am and I've been up all night so I'm gonna tap out for now
        if (clickCounter === 1) {
          breweryListEl.innerHTML = ""; // clears previous breweries displayed upon different event clicks

          // Check if brewery data exists for this event
          if (breweryList[n] && breweryList[n].length > 0) {
            for (r = 0; r < breweryList[n].length && r < 4; r++) {
              if (breweryList[n][r] && breweryList[n][r].name) {
                var breweryButton = document.createElement("button");
                breweryButton.className = "brewery-button";
                breweryButton.textContent = breweryList[n][r].name;

                // Add click event to open Google search in new tab
                breweryButton.addEventListener("click", function() {
                  var searchQuery = encodeURIComponent(this.textContent + " " + currentSearchedCity);
                  window.open("https://www.google.com/search?q=" + searchQuery, "_blank");
                });

                breweryListEl.appendChild(breweryButton);
              }
            }
          } else {
            var noBreweries = document.createElement("p");
            noBreweries.textContent = "No breweries found nearby.";
            noBreweries.className = "text-gray-600 text-center";
            breweryListEl.appendChild(noBreweries);
          }
          clickCounter = 0;
        } else if (clickCounter === 0) {
          if (breweryList[n] && breweryList[n].length > 0) {
            for (r = 0; r < breweryList[n].length && r < 4; r++) {
              if (breweryList[n][r] && breweryList[n][r].name) {
                breweryName.textContent = breweryList[n][r].name;
              }
            }
          }
          clickCounter += 1;
        }
      });
    }
    //console.log(listOfEvents);

    // Use requestAnimationFrame to ensure DOM is painted before scrolling
    requestAnimationFrame(function() {
      setTimeout(function() {
        console.log("Search completed, attempting to show events arrow");

        // Build genre display string
        var genreDisplay = genreApi.length > 0 ? genreApi.join(", ") : "All Genres";

        // Get date range
        var fromDate = localStorage.getItem("storedFrom");
        var toDate = localStorage.getItem("storedTo");
        var dateDisplay = "";

        if (fromDate && toDate) {
          // Remove quotes from localStorage values
          fromDate = fromDate.replace(/"/g, '');
          toDate = toDate.replace(/"/g, '');
          dateDisplay = " between " + fromDate + " and " + toDate;
        } else if (fromDate) {
          fromDate = fromDate.replace(/"/g, '');
          dateDisplay = " from " + fromDate;
        } else if (toDate) {
          toDate = toDate.replace(/"/g, '');
          dateDisplay = " until " + toDate;
        }

        // Update the events header
        var eventsHeader = document.querySelector("#ticketmaster-search-container h4");
        if (eventsHeader) {
          eventsHeader.innerHTML = "Events for " + genreDisplay + dateDisplay + ":";
        }

        // Show events section
        var eventsSection = document.getElementById("ticketmaster-search-container");
        if (eventsSection) {
          eventsSection.style.display = 'flex';
        }

        // Show events arrow immediately
        var eventsArrow = document.getElementById('scroll-arrow-events');
        console.log("Events arrow element:", eventsArrow);
        if (eventsArrow) {
          eventsArrow.style.display = 'flex';
          console.log("Events arrow display set to flex");
          // Auto-hide after 5 seconds
          setTimeout(function() {
            eventsArrow.style.display = 'none';
          }, 5000);
        } else {
          console.log("Events arrow element not found!");
        }

        // Then scroll
        if (eventsSection) {
          eventsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 300);
    });
  });
}

// Function to show/hide scroll arrow
function showScrollArrow(section) {
  var arrow = document.getElementById('scroll-arrow-' + section);
  if (arrow) {
    arrow.style.display = 'flex';
    // Auto-hide after 5 seconds
    setTimeout(function() {
      arrow.style.display = 'none';
    }, 5000);
  }
}

// Add click handlers to scroll arrows
document.addEventListener('DOMContentLoaded', function() {
  var eventsArrow = document.getElementById('scroll-arrow-events');
  var breweriesArrow = document.getElementById('scroll-arrow-breweries');

  if (eventsArrow) {
    eventsArrow.addEventListener('click', function() {
      var eventsSection = document.getElementById('ticketmaster-search-container');
      if (eventsSection) {
        eventsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        this.style.display = 'none';
      }
    });
  }

  if (breweriesArrow) {
    breweriesArrow.addEventListener('click', function() {
      var brewerySection = document.getElementById('brewery-search-container');
      if (brewerySection) {
        brewerySection.scrollIntoView({ behavior: 'smooth', block: 'center' });
        this.style.display = 'none';
      }
    });
  }
});


//declared arguments outside of scope for long and lat so they can be called during ticketmaster api fetch
var argums = { venueLat: "", venueLon: "" };

// breweryList holds all the arrays from brewery api call
var breweryList = [];
function venueToBreweriesAPI() {
  var pregameURL =
    "https://api.openbrewerydb.org/v1/breweries?by_dist=" +
    argums.venueLat +
    "," +
    argums.venueLon +
    "&per_page=3";

  return fetch(pregameURL)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      breweryList.push(data);
      //console.log(data)
      //console.log(breweryList);
    });
}

//start of calendar functionality
var date;
$(function () {
  var dateFormat = "mm/dd/yy",
    from = $("#from")
      .datepicker({
        defaultDate: "+1w",
        changeMonth: true,
        numberOfMonths: 1,
      })
      .on("change", function () {
        to.datepicker("option", "minDate", getDate(this));
        updateLocalStorage();
      }),
    to = $("#to")
      .datepicker({
        defaultDate: "+1w",
        changeMonth: true,
        numberOfMonths: 1,
      })
      .on("change", function () {
        from.datepicker("option", "maxDate", getDate(this));
        updateLocalStorage();
      });

  // Load dates from localStorage upon page refresh/load
  var storedFrom = localStorage.getItem("storedFrom");
  var storedTo = localStorage.getItem("storedTo");
  if (storedFrom && storedTo) {
    from.datepicker("setDate", new Date(storedFrom));
    to.datepicker("setDate", new Date(storedTo));
  }
  if (storedFrom) {
    from.datepicker("setDate", new Date(storedFrom));
  } else if (storedTo) {
    to.datepicker("setDate", new Date(storedTo));
  }

  function getDate(element) {
    try {
      date = $.datepicker.parseDate(dateFormat, element.value);
    } catch (error) {
      date = null;
    }
    //console.log(date);
    return date;
  }

  function updateLocalStorage() {
    // get selected dates from page
    var fromDate = from.datepicker("getDate");
    var toDate = to.datepicker("getDate");

    // Check if both dates are selected
    if (fromDate && toDate) {
      // Format dates with dayJS
      var formattedFrom = dayjs(fromDate).format("YYYY-MM-DD");
      var formattedTo = dayjs(toDate).format("YYYY-MM-DD");

      // Store formatted dates in localStorage
      localStorage.setItem("storedFrom", JSON.stringify(formattedFrom));
      localStorage.setItem("storedTo", JSON.stringify(formattedTo));
    }
  }
});

//start of checkbox functionality
var genreApi = [];
var genreString = "";

// Map checkbox IDs to TicketMaster classification codes
var genreCodeMap = {
  "Metal": "KnvZfZ7vAvt",
  "Rock": "KnvZfZ7vAeA",
  "Pop": "KnvZfZ7vAev",
  "Rap": "KnvZfZ7vAv1",  // Hip-Hop
  "Country": "KnvZfZ7vAv6"  // Country
};

var checkboxEl = document.getElementById("checkbox");

checkboxEl.addEventListener('click', function(event) {
  var targetEl = (event.target);
  var targetElText = targetEl.attributes.id.textContent;
  var index = genreApi.indexOf(targetElText);

  if (targetEl.value === 'no') {
    genreApi.push(targetElText);
    targetEl.value = 'yes';
  } else if (targetEl.value === 'yes') {
    genreApi.splice(index, 1);
    targetEl.value = 'no';
  }

  // Build genre code string for API (comma-separated for OR operation)
  var genreCodes = genreApi.map(function(genreName) {
    return genreCodeMap[genreName];
  }).filter(function(code) {
    return code !== undefined;
  });

  genreString = genreCodes.join(',');

  console.log("Selected genres:", genreApi);
  console.log("Genre codes for API:", genreString);
});

