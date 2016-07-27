function initAutocomplete() {
  var map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: -33.8688, lng: 151.2195},
    zoom: 13,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  });

  // Create the search box and link it to the UI element.
  var input = document.getElementById('pac-input');
  var searchBox = new google.maps.places.SearchBox(input);
  map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

  // Bias the SearchBox results towards current map's viewport.
  map.addListener('bounds_changed', function() {
    searchBox.setBounds(map.getBounds());
  });

  // Listen for the event fired when the user selects a prediction and retrieve
  // more details for that place.
  searchBox.addListener('places_changed', function() {
    var places = searchBox.getPlaces();

    if (places.length == 0) {
      return;
    }

    var bounds = new google.maps.LatLngBounds();
    var markers = [];
    places.forEach(function(place) {
      infowindow = new google.maps.InfoWindow();
      var service = new google.maps.places.PlacesService(map);
      var pyrmont = new Object({lat: place.geometry.location.lat(), lng:place.geometry.location.lng()});
      var types = ["restaurant", "school"];
      var colors = ["red", "green"];

      for (var j = 0; j < types.length; j++) {
        var color = 0;
        service.textSearch({
          location: pyrmont,
          radius: 500,
          type: types[j]
        }, function(response, status) { callback(response,status,color++);});
        function callback(results, status, pos) {
          if (status === google.maps.places.PlacesServiceStatus.OK) {
            for (var i = 0; i < results.length; i++) {
              createMarker(results[i], pos);
            }
          }
        }

        function createMarker(place, color) {
          var marker = new google.maps.Marker({
            map: map,
            icon: `http://maps.google.com/mapfiles/ms/icons/${colors[color]}-dot.png`,
            position: place.geometry.location,
            title: place.name
          });

          google.maps.event.addListener(marker, 'click', function() {
            infowindow.setContent('<strong>' +  marker.title + '</strong>');
            infowindow.open(map,marker);
          });
        }
      }
      if (place.geometry.viewport) {
        // Only geocodes have viewport.
        bounds.union(place.geometry.viewport);
      } else {
        bounds.extend(place.geometry.location);
      }
      map.setCenter(pyrmont);
      map.setZoom(13);

    });
    map.fitBounds(bounds);
  });
}
