// Store our API endpoint inside queryUrl
// var queryUrl = "https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=2014-01-01&endtime=" +
//   "2014-01-02&maxlongitude=-69.52148437&minlongitude=-123.83789062&maxlatitude=48.74894534&minlatitude=25.16517337";
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Perform a GET request to the query URL
d3.json(queryUrl, function(data) {
  // Once we get a response, send the data.features object to the createFeatures function
  createFeatures(data.features);
});

function createFeatures(earthquakeData) {

  // Define a function we want to run once for each feature in the features array
  // Give each feature a popup describing the place and time of the earthquake
  function onEachFeature(feature, layer) {
    layer.bindPopup("<h3>" + feature.properties.place +
      "</h3><hr><p>" + new Date(feature.properties.time) + "</p>");
  }

  // Create a GeoJSON layer containing the features array on the earthquakeData object
  // Run the onEachFeature function once for each piece of data in the array
  var earthquakes = L.geoJSON(earthquakeData, {
    onEachFeature: onEachFeature
  });

  // Sending our earthquakes layer to the createMap function
  createMap(earthquakes);
}

function createMap(earthquakes) {

  // Define streetmap and darkmap layers
  var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/streets-v11",
    accessToken: API_KEY
  });

  var darkmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "dark-v10",
    accessToken: API_KEY
  });

  // Define a baseMaps object to hold our base layers
  var baseMaps = {
    "Street Map": streetmap,
    "Dark Map": darkmap
  };

  // Create overlay object to hold our overlay layer
  var overlayMaps = {
    Earthquakes: earthquakes
  };

    // // limits and circle radius lists
    // var limits = [10, 20, 30, 40, 50, 60, 70, 80, 90, 200];
    // var radius = [6, 8, 10, 12, 14, 16, 17, 18, 19, 20];

    // // function to find the radius given the number of pets
    // function getRadius(d) {
    //     for (var i = 0; i < limits.length; i++) {
    //     if (d < limits[i]) {
    //         return radius[i];
    //     }
    //     else if (d > limits[limits.length - 1]) {
    //         return 10 + radius[limits.length-1];
    //     }
    //     }
    // }

    // function addMarkers() {
    //     data.forEach(function (d) {
    //     var marker = L.circleMarker([+d.Latitude, +d.Longitude])
    //         .bindPopup(`<strong>Organization: </strong> <a href='${d.url_y}' target='_blank'>${d.name_y}</a><hr style='margin:5px'><strong>Number of adoptable pets: </strong>${d["# of adoptable pets"]}<br><strong>Median pet age: </strong>${d.age}`);  ;
    //     var adult_dog = d.age === 'Adult';
    //     var color = colorScale[d.deviceControllerName] || '#6D98BA';
    //     if (adult_dog) {
    //         marker.setStyle({
    //         radius: getRadius(d["# of adoptable pets"]),
    //         fillColor: color,
    //         fillOpacity: 1,
    //         color: '#ddd',
    //         weight: 0.25
    //         });
    //     } else {
    //         marker.setStyle({
    //         radius: getRadius(d["# of adoptable pets"]),
    //         fillColor: otherPetColor,
    //         fillOpacity: 0.5,
    //         color: '#123',
    //         weight: 1
    //         });
    //     }
    
    //     marker.addTo(myMap);
    //     })
    // }


  // Create our map, giving it the streetmap and earthquakes layers to display on load
  var myMap = L.map("mapid", {
    center: [
      37.09, -95.71
    ],
    zoom: 5,
    layers: [streetmap, earthquakes]
  });

//   Create a layer control
//   Pass in our baseMaps and overlayMaps
//   Add the layer control to the map
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);

//     // Adding legend
//     var legend = L.control({ position: 'topright' });
//     legend.onAdd = function (myMap) {
//         // create div for legend
//         var div = L.DomUtil.create('div', 'info legend');
      
//         // add title for legend
//         div.innerHTML = '<h5>Median Pet Age<br>per Organization</h5>';
      
//         div.innerHTML += '<i style="background:' + adultPetColor + '"></i> Adult Pet<br>';
//         div.innerHTML += '<i style="background:' + otherPetColor + '"></i> Other Pet<br>';
       
//         return div;
//       }
      
//       // Adding legend to the map
//       legend.addTo(myMap);


}
