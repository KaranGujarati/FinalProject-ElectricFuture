// Store our API endpoint inside queryUrl
var queryUrl = "https://developer.nrel.gov/api/alt-fuel-stations/v1.json?fuel_type=E85,ELEC&country=CA&limit=200&api_key=X4t2CiF40eBpRAN8Upzc39c1YWCjcTKvgErGPZ3a&format=JSON";

// Perform a GET request to the query URL using D3
d3.json(queryUrl, function(data) {
    // Once we get a response, send the data.fuel_stations object from queryUrl to the createPopup function
    createPopup(data.fuel_stations);
});

// Function to create the popups
function createPopup(chargingData) {

    // Define a function we want to run once for each feature in the fuel_stations array
    // Give each feature a popup describing--name,phone,address,accesstime,facilitytype
    function onEachFeature(feature, layer) {
        layer.bindPopup("<h3>" + feature.station_name + feature.station_phone + "</h3><hr><p>"
                     + feature.facility_type + "</p><p>" 
                     + feature.access_code + feature.access_days_time + "</p><p>" 
                     + feature.street_address + "</p><p>"
                     + feature.city + feature.zip + "</p><p>"
                     + feature.state + feature.country + "</p>");
    }

    // Create a GeoJSON layer containing the fuel_stations array on the chargingData object
    // Run the onEachFeature function once for each piece of data in the array
    var chargePoints = L.geoJSON(chargingData, {
        onEachFeature: onEachFeature
    });

    // Sending our chargePoints layer to the createMap function
    createMap(chargePoints);
} // createPopup function ends here 


// function to create the map and layers (function spans the rest of the file)
function createMap(chargePoints) {

    // Define streetmap and darkmap layers
    // Streetmap layer
    var streetmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "mapbox.streets",
        accessToken: API_KEY
    });
    // Darkmap layer
    var darkmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "mapbox.dark",
        accessToken: API_KEY
    });
    var satellite = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>',
        maxZoom: 13,
        id: 'mapbox.satellite',
        accessToken: API_KEY
    });
  var grayscale = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>',
        maxZoom: 13,
        id: 'mapbox.light',
        accessToken: API_KEY
    });

  var outdoors = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>',
        maxZoom: 13,
        id: 'mapbox.outdoors',
        accessToken: API_KEY
    });

    // Define a baseMaps object to hold our base layers
    var baseMaps = {
        "Street Map": streetmap,
        "Satellite Map": satellite,
        "Grayscale Map": grayscale,
        "Outdoors Map": outdoors,
        "Dark Map": darkmap
    };

    // Create our map, giving it the streetmap and chargePoints layers to display on load
    var myMap = L.map("map", {
        center: [
            45, -75
        ],
        zoom: 7,
        layers: [streetmap, chargePoints]
    });


    // Functions to create the Charging Station Points
    // Perform a GET request to the query URL using D3
    d3.json(queryUrl, function(data) {
        // Once we get a response, send the data.fuel_stations object from queryUrl to the createFeature function
        createFeature(data.fuel_stations);
    });

    // createFeature function for circles
    function createFeature(chargingData) {
        console.log(chargingData)

        for (var i = 0; i < chargingData.length; i++) {

               var newMarker = L.marker([chargingData[i].latitude, chargingData[i].longitude])
               .bindPopup("<h3>" + chargingData[i].station_name + "</h3><hr><p>"
               + chargingData[i].facility_type + "</p><p>" 
               + chargingData[i].access_code + " , " + chargingData[i].access_days_time + "</p><p>" 
               + "DC Fast Charging points: " + chargingData[i].ev_dc_fast_num + "</p><p>"
               + "Level 1 Charging points: " + chargingData[i].ev_level1_evse_num + "</p><p>"
               + "Level 2 Charging points: " + chargingData[i].ev_level2_evse_num + "</p><p>"
               + chargingData[i].street_address + "</p><p>"
               + chargingData[i].city + " , " + chargingData[i].zip + "</p><p>"
               + chargingData[i].state + " , " + chargingData[i].country + "</p><p>"
               + "Phone Number: " + chargingData[i].station_phone + "</p>")
               .addTo(myMap);

        }
    } // end of createFeature function

    // Create overlay object to hold our overlay layer for the charging station Points
    var overlayMaps = {
        "ChargingPoints Popup": chargePoints,
    };
    // Create a layer for the control panel by passing in our baseMaps and overlayMaps
    L.control.layers(baseMaps, null , {collapsed: true}).addTo(myMap);
};