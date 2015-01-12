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
function shelterDetails(shelter){
  var contentString = "<div id='wrapper' style='width: 100%; height: 110%; font-size: 20px'><div id='name', style='font-size: 24px; font-weight:bold' >"+ shelter.name + "</div><div id='phone'>" + shelter.phone + "</div>" + "<div id='hours'> Open: " + shelter.hours.open + "   Close: " + shelter.hours.close + "</div>" + "<a href=" + shelter.url + ">"+ shelter.url+ "</a><br/><div style='font-size:12px'>Last updated:" + new Date(shelter.updatedAt).toString() + "</div>";

  if(shelter.facilities.shower == true){
    contentString += ("<img style='margin:5px' src='/img/shower.png'>");
  }
  if(shelter.facilities.wifi == true){
    contentString += ("<img style='margin:5px' src='/img/wifi.png'>");
  }
  if(shelter.facilities.pets == true){
    contentString += ("<img style='margin:5px' src='/img/pets.png'>");
  }
  if(shelter.facilities.food == true){
    contentString += ("<img style='margin:5px' src='/img/food.png'>");
  }
  return contentString + "</div>";
}

function mealDetails(meal){
  var contentString = "<div id='wrapper'><div id='meal-name', style='font-size: 24px; font-weight:bold'>"+ meal.name + "</div><div id='meal-phone'>" + meal.phone + "</div><div id='meal-address', style='font-size:18px;'>" + meal.address + "</div></div id='meal-hours'>" + meal.hours //+ "</div><div id='event-time'>" + meal.time;
  if (meal.url){
    contentString+= '<br/><a href=' + meal.url + ">" + meal.url + "</a>";
  }

  return contentString;
}

function clothDetails(cloth){
  var contentString = "<div id='wrapper'><div id='cloth-name', style='font-size: 24px; font-weight:bold'>"+ cloth.name + "</div><div id='cloth-phone'>" + cloth.phone + "</div><div id='cloth-address', style='font-size:18px;'>" + cloth.address + "</div></div id='cloth-hours'>" + cloth.hours //+ "</div><div id='event-time'>" + cloth.time;
  if (cloth.url){
    contentString+= '<br/><a href=' + cloth.url + ">" + cloth.url + "</a>";
  }

  return contentString;
}

function openSoloWindow(infowindow, marker){
  //close the last opened window first
  if (typeof openWindow != "undefined"){
    openWindow.close();
  }
  infowindow.open(map, marker);
  openWindow = infowindow
}


function makeMarker(item, iconpath){
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

function loadMarker(name, thing){
  var marker = makeMarker(thing, filters[name]);

  markerObjects[name][thing.name] = marker;
  
  switch(name){
    case 'shelters':
      var contentString = shelterDetails(thing);
      break;
    case 'clothing':
      var contentString = clothDetails(thing);
      break;
    case 'meals':
      var contentString = mealDetails(thing);
      break;
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


function toggleFilter(filterKey){
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