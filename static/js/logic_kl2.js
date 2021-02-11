// base url = https://earthquake.usgs.gov/earthquakes/feed/v1.0/geojson.php
// Store our API endpoint inside queryUrl
// var queryUrl = "https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=2014-01-01&endtime=" +
//   "2014-01-02&maxlongitude=-69.52148437&minlongitude=-123.83789062&maxlatitude=48.74894534&minlatitude=25.16517337";
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Perform a GET request to the query URL
// d3.json(queryUrl, function(record) {
//   // Once we get a response, send the data.features object to the createFeatures function
//   createFeatures(record.features);
//   console.log(record.features);
// });

// Get magnitudes 
d3.json(queryUrl, function(record) {
  // Once we get a response, send the data.features object to the createFeatures function
  // createMag(data.features.properties.magnitude);
  
  // -- this prints the first of the 2181 objects/elements in the Features array.
  console.log(record.features[0]); 
  // -- this prints the id of the first of the 2181 objects/elements in the Features array.
  console.log(record.features[0].id);
  // -- this prints the the properties  of the first of the 2181 objects/elements in the Features array.
  console.log(record.features[0].properties)
  // Now need to get to a key value for magnitude inside the properties - calling the value from the dictionary key - YAY!! 
  console.log(record.features[0].properties["mag"])
  // Now need to get to a key value for EQ depth inside the geometry - calling the value from the dictionary key - YAY!! 
  console.log(record.features[0].geometry["coordinates"][2])
  // get locations for binding markers - longitude
  console.log(record.features[0].geometry["coordinates"][0])
  // get locations for binding markers - latitude
  console.log(record.features[0].geometry["coordinates"][1])


  // Assign color to EQ based on depth)
  // first, get list of depths to get an idea of the range. Per USGS, depth measured in kilometers 
  // but the reference point is variable so anyone viewing this visualization should be careful!  
  // It may not be as it seems.   
  var depths = []
  for (var i = 0; i < record.features.length; i++) {
    // console.log(Math.max(record.features[i].geometry["coordinates"][2]))
   if (record.features[i].geometry["coordinates"][2] !== null) {
    depths.push(parseInt(record.features[i].geometry["coordinates"][2]))
   }
  }
  console.log(Math.max.apply(Math, depths))
  console.log(Math.min.apply(Math, depths))
  // Min = -4, Max = 626

  // Color values:  less than 0, 20, 40, 60, 80, 100, greater than 100 
  // for (var i = 0; i < record.features.length; i++) {
  //   var color = "";
  //   if (record.features[i].geometry["coordinates"][2] > 100) {
  //      color = "red"
  //   }
  //   else if (record.features[i].geometry["coordinates"][2] > 80) {
  //     color = "orange"
  //   } 
  //   else if (record.features[i].geometry["coordinates"][2] > 60) {
  //     color = "yellow"
  //   } 
  //   else if (record.features[i].geometry["coordinates"][2] > 40) {
  //     color = "Green"
  //   } 
  //   else if (record.features[i].geometry["coordinates"][2] > 20) {
  //     color = "cyan"
  //   } 
  //   else if (record.features[i].geometry["coordinates"][2] > 0) {
  //     color = "blue"
  //   } 
  //   else {
  //     color = "indigo"
  //   } 

  // Add circles to map
  
  var markerData
  function addMarkers() {
    markerData.forEach(function (record) {
      for (var i = 0; i < record.features.length; i++) {
        var color = "";
        if (record.features[i].geometry["coordinates"][2] > 100) {
           color = "red"
        }
        else if (record.features[i].geometry["coordinates"][2] > 80) {
          color = "orange"
        } 
        else if (record.features[i].geometry["coordinates"][2] > 60) {
          color = "yellow"
        } 
        else if (record.features[i].geometry["coordinates"][2] > 40) {
          color = "Green"
        } 
        else if (record.features[i].geometry["coordinates"][2] > 20) {
          color = "cyan"
        } 
        else if (record.features[i].geometry["coordinates"][2] > 0) {
          color = "blue"
        } 
        else {
          color = "indigo"
        } 

      // var marker = L.circle([(record.features[i].geometry["coordinates"][1], record.features[i].geometry["coordinates"][0])]
     L.circle([(record.features[i].geometry["coordinates"][1], record.features[i].geometry["coordinates"][0])], {
        fillOpacity: 0.75,
        color: "black",
        fillColor: color,
        radius: record.features[i].properties["mag"]
      }).bindPopup("<h3>" + record.features[i].properties["place"] + "</h3><hr><p>" + "Datetime :" + new Date(record.features[i].properties["time"]) 
        // + "Magnitude: " + record.features[i].properties["mag"] + "</p>").addTo(myMap);
        + "Magnitude: " + record.features[i].properties["mag"] + "</p>");
      }
})

      // for (var i = 0; i < record.features.length; i++) {
      //   var color = "";
      //   if (record.features[i].geometry["coordinates"][2] > 100) {
      //      color = "red"
      //   }
      //   else if (record.features[i].geometry["coordinates"][2] > 80) {
      //     color = "orange"
      //   } 
      //   else if (record.features[i].geometry["coordinates"][2] > 60) {
      //     color = "yellow"
      //   } 
      //   else if (record.features[i].geometry["coordinates"][2] > 40) {
      //     color = "Green"
      //   } 
      //   else if (record.features[i].geometry["coordinates"][2] > 20) {
      //     color = "cyan"
      //   } 
      //   else if (record.features[i].geometry["coordinates"][2] > 0) {
      //     color = "blue"
      //   } 
      //   else {
      //     color = "indigo"
      //   } 



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

  var satellite = L.tileLayer('http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}?access_token={accessToken}', {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    subdomains:['mt0','mt1','mt2','mt3']
  });


  // Define a baseMaps object to hold our base layers
  var baseMaps = {
    "Street Map": streetmap,
    "Dark Map": darkmap,
    "Satellite": satellite
  };

  // Create overlay object to hold our overlay layer
  var overlayMaps = {
    Earthquakes: earthquakes
  };


  // Create our map, giving it the streetmap and earthquakes layers to display on load
  var myMap = L.map("mapid", {
    center: [
      37.09, -95.71
    ],
    zoom: 5,
    layers: [streetmap, earthquakes]
  });

//   Create a layer control, pass in baseMaps and overlayMaps, add layer control to the map
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);

    // // Adding legend
    // var legend = L.control({ position: 'topright' });
    // legend.onAdd = function (myMap) {
    //     // create div for legend
    //     var div = L.DomUtil.create('div', 'info legend');
      
    //     // add title for legend
    //     div.innerHTML = '<h5>Median Pet Age<br>per Organization</h5>';
      
    //     div.innerHTML += '<i style="background:' + adultPetColor + '"></i> Adult Pet<br>';
    //     div.innerHTML += '<i style="background:' + otherPetColor + '"></i> Other Pet<br>';
       
    //     return div;
    //   }
      
    //   // Adding legend to the map
    //   legend.addTo(myMap);

}