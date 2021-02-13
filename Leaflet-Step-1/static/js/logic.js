// Dataset = Earthquakes over the past week
// base url = https://earthquake.usgs.gov/earthquakes/feed/v1.0/geojson.php
// Store our API endpoint inside queryUrl

var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Perform a GET request to the query URL
d3.json(queryUrl, function (record) {
  // Once we get a response, send the data.features object to the createFeatures function
  createFeatures(record.features);
  
  // create markerColor function
  function markerColor(depth) {
    if (depth > 150) {
      return "maroon";
    }
    else if (depth > 100) {
      return "red";
    }
    else if (depth > 50) {
      return "tomato";
    }
    else if (depth > 30) {
      return "darkorange";
    }
    else if (depth > 10) {
      return "yellow";
    }
    else {
      return "lightgreen";
    }
  }
  
  function createFeatures(earthquakeData) {
    // Define a function we want to run once for each feature in the features array
    // Give each feature a popup describing the place, time, magnitude, and depth of the earthquake
    function onEachFeature(record, layer) {
      layer.bindPopup("<strong>Location</strong>: " + record.properties.place +
        "<hr><strong>DateTime</strong>: " + new Date(record.properties.time) + "<hr>" +
        "<strong>Magnitude</strong>: " + record.properties.mag + "; " +
        "<strong>Depth (km)</strong>: " + record.geometry["coordinates"][2]);
    }
    // Create a GeoJSON layer containing the features array on the earthquakeData object
    // Run the onEachFeature function once for each piece of data in the array
    var earthquakes = L.geoJSON(earthquakeData, {
      onEachFeature: onEachFeature,
      pointToLayer: function (record, latlng) {
        var markerType = {
          radius: 3.5 * record.properties.mag,
          fillColor: markerColor(record.geometry["coordinates"][2]),
          color: "black",
          weight: 1,
          fillOpacity: 0.8
        };
        return L.circleMarker(latlng, markerType);
      }
    });
    // Send our earthquakes layer to the createMap function
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
    var satellite = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
      attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
      maxZoom: 18,
      id: "satellite-streets-v10",
      accessToken: API_KEY
    });

    // Define a baseMaps object to hold our base layers
    var baseMaps = {
      "Light Map": lightmap,
      "Satellite": satellite,
      "Street Map": streetmap,
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
        lightmap,
        earthquakes,
      ]
    })

    // Create a layer control, pass in baseMaps and overlayMaps, add to myMap
    L.control.layers(baseMaps, overlayMaps, {
      collapsed: false
    }).addTo(myMap)

    // Add Legend
    var legend = L.control({ position: "bottomright" });
    legend.onAdd = function (map) {
      var div = L.DomUtil.create("div", "info legend");
      div.innerHTML += "<strong>Depth (km)</strong><br>";
      div.innerHTML += '<i style="background: lightgreen"></i><span><10</span><br>';
      div.innerHTML += '<i style="background: yellow"></i><span>10-30</span><br>';
      div.innerHTML += '<i style="background: darkorange"></i><span>30-50</span><br>';
      div.innerHTML += '<i style="background: tomato"></i><span>50-100</span><br>';
      div.innerHTML += '<i style="background: red"></i><span>100-150</span><br>';
      div.innerHTML += '<i style="background: maroon"></i><span>150+</span><br>';
      return div;
    }
    legend.addTo(myMap);
  }
});

