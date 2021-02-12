
// Dataset = Earthquakes over the past week
// base url = https://earthquake.usgs.gov/earthquakes/feed/v1.0/geojson.php
// Store our API endpoint inside queryUrl

var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Perform a GET request to the query URL
d3.json(queryUrl, function(record) {
  // Once we get a response, send the data.features object to the createFeatures function
  createFeatures(record.features);

  // finding the data withing the d3.json call
  // -- this prints the first of the 2181 objects/elements in the Features array.
  console.log(record.features[0]); 
  // -- this prints the id of the first of the 2181 objects/elements in the Features array.
  console.log(record.features[0].id);
  // -- this prints the the properties  of the first of the 2181 objects/elements in the Features array.
  console.log(record.features[0].properties)
  // Now need to get to a key value for magnitude inside the properties - calling the value from the dictionary key 
  console.log(record.features[0].properties["mag"])
  // Now need to get to a key value for EQ depth inside the geometry - calling the value from the dictionary key  
  console.log(record.features[0].geometry["coordinates"][2])
  // get locations for binding markers - longitude
  console.log(record.features[0].geometry["coordinates"][0])
  // get locations for binding markers - latitude
  console.log(record.features[0].geometry["coordinates"][1])

// });
    // create markerColor(depth);

    function markerColor(depth) {
      switch(true){
        case (depth > 150):
          return "red";
        case (depth > 100):
          return "tomato";
        case (depth > 50):
          return "orange";
        case (depth > 30):
          return "gold";
        case (depth > 20):
          return "yellow";
        case (depth > 10):
          return "greenyellow";
        default:
          return "lime";

      }
    }

        // var depths = []
        // for (var i = 0; i < record.features.length; i++) {
        //   // console.log(Math.max(record.features[i].geometry["coordinates"][2]))
        //   if (record.features[i].geometry["coordinates"][2] !== null) {
        //   depths.push(parseInt(record.features[i].geometry["coordinates"][2]))
        //   }
        // }
        // console.log(Math.max.apply(Math, depths))
        // console.log(Math.min.apply(Math, depths))
        // Min = -4, Max = 626
        
        // Color values for depths:  less than 10, 20, 30, 50, 100, greater than 150
        //  lime, greenyellow, yellow, gold, orange, tomato, red
        // for (var i = 0; i < record.features.length; i++) {
        // // for (var i = 0; i < depths.length; i++) {
        //   var color = "";
        //   if (record.features[i].geometry["coordinates"][2] > 150) {
        //     color = "red"
            // console.log(color)
          // }
          // else if (record.features[i].geometry["coordinates"][2] > 100) {
          //   // color = "orange"
          //   color = "tomato"
          // } 
          // else if (record.features[i].geometry["coordinates"][2] > 50) {
          //   // color = "yellow"
          //   color = "orange"
          // } 
          // else if (record.features[i].geometry["coordinates"][2] > 30) {
          //   // color = "Green"
          //   // color = "greenyellow"
          //   color = "gold"
          // } 
          // else if (record.features[i].geometry["coordinates"][2] > 20) {
          //   // color = "cyan"
          //   // color = "lime"
          //   color = "yellow"
          // } 
          // else if (record.features[i].geometry["coordinates"][2] > 10) {
          //   // color = "blue"
          //   color = "greenyellow"
          // } 
          // else {
          //   // color = "indigo"
          //   color = "lime"
          // } 

          // if (record.features[i].geometry["coordinates"][2] < 10) {
          //   color = "lime"
          //   // console.log(color)
          // }
          // else if (record.features[i].geometry["coordinates"][2] < 20) {
          //   // color = "orange"
          //   color = "greenyellow"
          // } 
          // else if (record.features[i].geometry["coordinates"][2] < 30) {
          //   // color = "yellow"
          //   color = "yellow"
          // } 
          // else if (record.features[i].geometry["coordinates"][2] < 40) {
          //   // color = "Green"
          //   // color = "greenyellow"
          //   color = "gold"
          // } 
          // else if (record.features[i].geometry["coordinates"][2] < 50) {
          //   // color = "cyan"
          //   // color = "lime"
          //   color = "orange"
          // } 
          // else if (record.features[i].geometry["coordinates"][2] < 100) {
          //   // color = "blue"
          //   color = "tomato"
          // } 
          // else {
          //   // color = "indigo"
          //   color = "red"
          // } 
        // }

      // return color;
    // }
// });

      function createFeatures(earthquakeData) {
        // Define a function we want to run once for each feature in the features array
        // Give each feature a popup describing the place, time, and magnitude of  the earthquake
        function onEachFeature(record, layer) {
          layer.bindPopup("<strong>Location</strong>: " + record.properties.place +
            "<hr><strong>DateTime</strong>: " + new Date(record.properties.time) + "<hr>" + 
            "<strong>Magnitude</strong>: " + record.properties.mag + "; " + 
            "<strong>Depth (km)</strong>: " + record.geometry["coordinates"][2]);
        }
// });
          // Create a GeoJSON layer containing the features array on the earthquakeData object
          // Run the onEachFeature function once for each piece of data in the array
          var earthquakes = L.geoJSON(earthquakeData, {
            onEachFeature: onEachFeature,
            pointToLayer: function (record, latlng) {
              var markerType = {
              radius: 3.5*record.properties.mag,
              // fillColor: markerColor(depths),
              // fillColor: color,
              fillColor: markerColor(record.geometry["coordinates"][2]),
              // fillColor: color,
              color: "black",
              // fillColor: markerColor
              weight: 1,
              // opacity: 0.5,
              fillOpacity: 0.5
              };
              return L.circleMarker(latlng, markerType);
            }
          });
        
    // Sending our earthquakes layer to the createMap function
        createMap(earthquakes);
      }

      function createMap(earthquakes) {

          // Define map type layers
          var lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
            attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
            maxZoom: 18,
            id: "light-v10",
            accessToken: API_KEY
          });

          var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
            attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
            tileSize: 512,
            maxZoom: 18,
            zoomOffset: -1,
            id: "mapbox/streets-v11",
            accessToken: API_KEY
          });

          // var darkmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
          //   attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
          //   maxZoom: 18,
          //   id: "dark-v10",
          //   accessToken: API_KEY
          // });
        //  Google satellite layer - opted to use leaflet version instead 
        // var satellite = L.tileLayer('http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}', {
        //   maxZoom: 18,
        //   subdomains:['mt0','mt1','mt2','mt3']
        // })
          var satellite = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
            attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
            maxZoom: 18,
            id: "satellite-streets-v10",
            accessToken: API_KEY
          });
          
        // Define a baseMaps object to hold our base layers
        var baseMaps = {
          "Light Map": lightmap,
          "Street Map": streetmap,
          // "Dark Map": darkmap,
          "Satellite": satellite
        }

        // Create overlay object to hold our overlay layer
        var overlayMaps = {
          Earthquakes: earthquakes
        }

        // Create our map, giving it the streetmap and earthquakes layers to display on load
        var myMap = L.map("mapid", {
          center: [
            37.09, -95.71
          ],
          zoom: 5,
          layers: [
            // streetmap, 
            // satellite, 
            lightmap,
            earthquakes,
            // markerColor
          ]
          })

    // Create a layer control
    // Pass in our baseMaps and overlayMaps
    // Add the layer control to the map
    L.control.layers(baseMaps, overlayMaps, {
      collapsed: false
    }).addTo(myMap)
  }
});

