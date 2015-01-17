$(document).ready(function () {
    setTimeout(function () {
        swal({title: 'Hold On!',
        text: 'Please dial 2-1-1 for assistance before using this resource!',
        type: 'warning',
        confirmButtonText: 'Got it.',
        confirmButtonColor: '#196CBF'});
    }, 1000);
});

/*  DETAILS FOR DATABASE ITEMS */

// Each filter must have a function for assembling the info window HTML
function shelterDetails(shelter) {

  var contentString = defaultDetails(shelter);

  if(shelter.facilities.shower == true) {
    contentString += ("<img style='margin:5px' src='/img/shower.png'>");
  }
  if(shelter.facilities.wifi == true) {
    contentString += ("<img style='margin:5px' src='/img/wifi.png'>");
  }
  if(shelter.facilities.pets == true) {
    contentString += ("<img style='margin:5px' src='/img/pets.png'>");
  }
  if(shelter.facilities.food == true) {
    contentString += ("<img style='margin:5px' src='/img/food.png'>");
  }
  return contentString;
}

function contains(array, item) {
  return array.indexOf(item) >= 0;
}

function defaultDetails(dbitem) {
  var item_keys = Object.keys(dbitem);
  var contentString = "<div id='wrapper'>";
  if (contains(item_keys, 'name')) {
    contentString += "<div id=dbitem-name>" + dbitem['name'] + "</div>";
  }
  if (contains(item_keys, 'phone')) {
    contentString += "<div id=dbitem-phone>" + dbitem['phone'] + "</div>";
  }
  if (contains(item_keys, 'location')) {
    contentString += "<div id=dbitem-address>" + dbitem['location'] + "</div>";
  }
  if (contains(item_keys, 'address')) {
    contentString += "<div id=dbitem-address>" + dbitem['address'] + "</div>";
  }
  if (contains(item_keys, 'hours')) {
    // non-uniform hours format in database
    if (typeof(dbitem.hours) === "object") {
      var hours = "Open: " + dbitem.hours.open + "   Close: " + dbitem.hours.close;
    } else {
      var hours = dbitem.hours;
    }
    contentString += "<div id=dbitem-hours>" + hours + "</div>";
  }
  if (contains(item_keys, 'url')) {
    contentString += "<div id=dbitem-url><a href=" + dbitem['url'] + ">" + dbitem['url'] + "</a></div>";
  }
  if (contains(item_keys, 'updatedAt')) {
    contentString += "<div id=dbitem-updated>Last updated: " + new Date(dbitem.updatedAt).toString() + "</div>";
  }
  contentString += "</div>";
  return contentString;
}

function openSoloWindow(infowindow, marker) {
  //close the last opened window first
  if (typeof openWindow != "undefined") {
    openWindow.close();
  }
  infowindow.open(map, marker);
  openWindow = infowindow;
}


function makeMarker(item, iconpath) {
  // To add the marker to the map, use the 'map' property
  var coords = item.coords.l
  var latLong = new google.maps.LatLng(coords[0], coords[1]);
  var marker = new google.maps.Marker({
      position: latLong,
      map: map,
      icon: iconpath
  });
  return marker
}

function loadMarker(name, mapitem) {
  var marker = makeMarker(mapitem, filters[name]);
  markerObjects[name][mapitem.name] = marker;
  
  switch(name){
    case 'shelters':
      var contentString = shelterDetails(mapitem);
      break;
    default:
      var contentString = defaultDetails(mapitem);
  }

  var infowindow = new google.maps.InfoWindow({
    content: contentString
  });
  google.maps.event.addListener(marker, 'click', function(){openSoloWindow(infowindow, marker)});

}

/*  GEOLOCATE  */

// Get the location of the user, re-intialize map to that location
// navigator.geolocation.getCurrentPosition(getUserPosition, function(error){console.log("Error with user location:", error.message)})
//
// function getUserPosition(position){
//     center = [position.coords.latitude, position.coords.longitude];
//     locations["PDXSheltersHQ"] = center
//     initializeMap()
// }



/*  GOOGLE MAPS  */

/* Initializes Google Maps */
function initializeMap() {
  // Get the location as a Google Maps latitude-longitude object
  var loc = new google.maps.LatLng(center[0], center[1]);

  // Create the Google Map
  map = new google.maps.Map(document.getElementById("map-canvas"), {
    center: loc,
    zoom: 14,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  });
 }


function toggleFilter(filterKey) {
  showFilters[filterKey] = !showFilters[filterKey];
  markers = markerObjects[filterKey];
  for (name in markers){
    markers[name].setVisible(showFilters[filterKey]);
  }
}

function overlay() {
  el = document.getElementById("overlay");
  el.style.visibility = (el.style.visibility == "visible") ? "hidden" : "visible";
}

/* Initialize Map with markers */

var map;

// Set the center as Firebase HQ
var locations = {
  "PDXSheltersHQ": [45.531436, -122.655222]
};
var center = locations["PDXSheltersHQ"];

var filters = {'shelters': '/img/shelterMarker.png', 
               'meals': '/img/mealMarker.png', 
               'clothing': '/img/clothMarker.png'};

// Get references to the Firebase data sets
var firebaseRefs = {};
var showFilters = {};
var markerObjects = {};
for (var filter in filters) {
  firebaseRefs[filter]= new Firebase("https://pdxshelters.firebaseio.com/" + filter);
  showFilters[filter] = true;
  markerObjects[filter] = {};
}

// Add a marker to the map for each item in the DB
for (var ref in firebaseRefs){
  firebaseRefs[ref].once('value', function(dataSnapshot){
    dataSnapshot.forEach(function(child){
      loadMarker(dataSnapshot.key(), child.val());
    });
  });
}

var openWindow;