// TicketMaster API Set-up

// According to https://developer.ticketmaster.com/products-and-docs/apis/discovery-api/v2/#anchor_getGenre, we want to use
// classificationId for genre-type searches, attractionID for artist or sport specifically,

// NEED TO ADD CITY TO LAT LONG FUNCTIONALITY

function getTicketMasterEventsAPI(city="San Diego", keyWord='rock', radius=50) {
    var requestURL = 'https://app.ticketmaster.com/discovery/v2/events.json?'  + 
    'keyword='+ keyWord +
    // '&postalCode='+ postalCode + 
    '&city=' + city + 
    '&radius=' +radius+
    '&unit=miles' + 
    '&size=100' +
    '&apikey=Wy4kfV2CuBeyHrZmzpbvUf5VYbT9wXmJ';

    fetch(requestURL)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log(data)
        });
}

getTicketMasterEventsAPI();

getTicketMasterEventsAPI("Los Angeles", "Pop");


//start of calendar functionality
import DateRangePicker from 'flowbite-datepicker/DateRangePicker';
const dateRangePickerEl = document.getElementById('#datepicker');
new DateRangePicker(dateRangePickerEl, {

});