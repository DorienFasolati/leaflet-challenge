    var myMap = L.map("map", {
        center: [15.5994, -28.6731],
        zoom: 3
    });
     
  
    var color = ['#DAF7A6', '#FFC300', '#FF5733', '#C70039', '#900C3F', '#581845']

    function fillColor(feature) {
        if (feature.properties.mag <= 1) {
            return color[0]
        }
        else if (feature.properties.mag <= 2) {
            return color[1]    
        }
        else if (feature.properties.mag <= 3) {
            return color[2]  
        } 
        else if (feature.properties.mag <= 4) {
            return color[3]  
        }
        else if (feature.properties.mag <= 5) {
            return color[4]  
        }
        else {
            return color[5]  
        }
    
        }

        function magRadius(feature) {
            return Math.sqrt(Math.abs(feature.properties.mag)) * 5;
        }

    var url = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson';
    

    // Perform a GET request to the query URL
d3.json(url, function(earthquakeData) {
    // Once we get a response, send the data.features object to the createFeatures function
    createFeatures(earthquakeData)
    console.log(earthquakeData);
  });

  function createFeatures(earthquakeData) {

     // Define a function we want to run once for each feature in the features array
        // Give each feature a popup describing the place and time of the earthquake
      

         
        
          // Create a GeoJSON layer containing the features array on the earthquakeData object
        //   // Run the onEachFeature function once for each piece of data in the array
     
        
     
          var earthquakes = L.geoJSON(earthquakeData, {
            
            pointToLayer: function (feature, latlng) {
                var geojsonMarkerOptions = {
                    radius: 4,
                    fillColor: fillColor(feature),
                    color: fillColor(feature),
                    weight: 2,
                    opacity: 5,
                    fillOpacity: 0.4,
                    radius: magRadius(feature)
                };
                return L.circleMarker(latlng,geojsonMarkerOptions)
                },
        
            onEachFeature: function (feature, layer) {
                return layer.bindPopup("<h3>" + feature.properties.place +
            "</h3><hr><p>" + new Date(feature.properties.time) + "<br>" + "Magnitude: " + feature.properties.mag + "</p>")}
          });
        
          // Sending our earthquakes layer to the createMap function
          createMap(earthquakes);
         
    
}


    function createMap(earthquakes) {
    
    // Define streetmap and darkmap layers
    var streetmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "mapbox.streets",
        accessToken: API_KEY
    });
    
    var darkmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "mapbox.dark",
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
    
    // Create our map, giving it the streetmap and earthquakes layers to display on load
   
    
    // Create a layer control
    // Pass in our baseMaps and overlayMaps
    // Add the layer control to the map
    L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
    }).addTo(myMap);

    var legend = L.control({ position: "bottomright" });
    legend.onAdd = function() {
      var div = L.DomUtil.create("div", "info legend");
      var categories = ["0-1", "1-2", "2-3", "3-4", "4-5", "5+"];
      var magColor = [];
      var magText = [];

      // Add min & max
      categories.forEach(function(category, index) {
        magColor.push(`<li style="background-color: ${color[index]};"></li>`); // 
        magText.push(`<span class="legend">${categories[index]}</span>`)
      });

      var magColorHtml =  "<ul>" + magColor.join("") + "</ul>";
      var magTextHtml = `<div id="legend-text">${magText.join("<br>")}</div>`;

      var legendInfo = "<h4>Magnitude<br>Scale</h4>" +
        "<div class=\"labels\">" + magColorHtml + magTextHtml
        "</div>";
      div.innerHTML = legendInfo;

      return div;
    };

    
        legend.addTo(myMap);

    }   

    
