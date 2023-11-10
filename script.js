


function breweryApi() {
    var breweryUrl = 'https://api.openbrewerydb.org/v1/breweries?by_dist=38.89,77.03&per_page=3';//need to add long/lat when adding search function

    fetch(breweryUrl)
        .then(function (response) {
            return response.json();
        })
        .then (function (data) {
            console.log(data)
        })
};

breweryApi();