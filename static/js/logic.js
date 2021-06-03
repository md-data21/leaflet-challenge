
// Query pull from https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson
var queryURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson";

d3.json(queryURL).then(function (data) {
    createFeatures(data.features);
});

function createFeatures(earthquakeData) {
    function styleInfo(feature) {
        return{
        radius: getRadius(feature.properties.mag),
        fillColor: getColor(feature.geometry.coordinates[2]),
        color: "#000",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8
        }
    };
    
    function getColor(depth) {
        switch(true){
            case depth>90:
                return "red";
            case depth>70:
                return "yellow";
            case depth > 50:
                return "green";
            case depth >30:
                return "blue";
            case depth > 10:
                return "purple";
            default:
                return "white";
            }
         }
    function getRadius(magnitude) {
        if (magnitude == 0){
            return 1;
        }
       
        else {
            return magnitude*4;
        }
    }

    
    function onEachFeature(feature, layer) {
        layer.bindPopup("<h3>Place: " + feature.properties.place + "<br>Depth: "+feature.geometry.coordinates[2]+ "<br>Magnitude: "+feature.properties.mag+"</h3><hr><p>" + new Date(feature.properties.time) + "</p>");
    }


var earthquakes = L.geoJson(earthquakeData, {
    onEachFeature: onEachFeature,
    pointToLayer: function (feature, latlng) {
        return L.circleMarker(latlng)
    },
    style: styleInfo
});



createMap(earthquakes);
}
function createMap(earthquakes) {
  // Create the base layers.
  var street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  })

  var topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
  });

  // Create a baseMaps object.
  var baseMaps = {
    "Street Map": street,
    "Topographic Map": topo
  };

  // Create an overlay object to hold our overlay.
  var overlayMaps = {
    Earthquakes: earthquakes
  };

  // Create our map, giving it the streetmap and earthquakes layers to display on load.
  var myMap = L.map("mapid", {
    center: [
      37.09, -95.71
    ],
    zoom: 3,
    layers: [street, earthquakes]
  });

  // Create a layer control.
  // Pass it our baseMaps and overlayMaps.
  // Add the layer control to the map.
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);

  var legend = L.control({position: 'bottomright'});

  legend.onAdd = function () {
  
      var div = L.DomUtil.create('div', 'info legend'),
          grades = [-10, 10, 30, 50, 70, 90],
          colors = ["white", "purple", "blue", "green", "yellow", "red"];
  
      // loop through our density intervals and generate a label with a colored square for each interval
      for (var i = 0; i < grades.length; i++) {
          div.innerHTML +=
              '<i style="background:' + colors[i] + '"></i> ' +
              grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
      }
  
      return div;
  };
  
  legend.addTo(myMap);
}
