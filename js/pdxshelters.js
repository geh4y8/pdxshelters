$(document).ready(function () {
    setTimeout(function () {
        swal({title: 'Hold On!',
        text: 'Please dial 2-1-1 for assistance before using this resource!',
        type: 'warning',
        confirmButtonText: 'Got it.'});
    }, 1000);
});

var map;

// Set the center as Firebase HQ
var locations = {
  "PDXSheltersHQ": [45.531436, -122.655222]
};
var center = locations["PDXSheltersHQ"];

// Get a reference to the Firebase data set
var sheltersFirebaseRef = new Firebase("https://pdxshelters.firebaseio.com/shelters");
var eventsFirebaseRef = new Firebase("https://pdxshelters.firebaseio.com/events");
var mealsFirebaseRef = new Firebase("https://pdxshelters.firebaseio.com/meals");
var clothFirebaseRef = new Firebase("https://pdxshelters.firebaseio.com/clothing");

sheltersFirebaseRef.on("child_changed", function(snapshot) {
  var changedShelter = snapshot.val();
  var marker = shelterMarkerObjects[changedShelter.name];
  marker.setIcon(shelterIconName(changedShelter));
});

sheltersFirebaseRef.on("child_added", function(snapshot) {
  var newShelter = snapshot.val();
});

//Create a new GeoFire instance
var geoFire = new GeoFire(sheltersFirebaseRef);
var shelterMarkerObjects = {};
var eventMarkerObjects = {};
var mealMarkerObjects = {};
var clothMarkerObjects = {};
var openWindow;

function openSoloWindow(infowindow, marker){
  //close the last opened window first
  if (typeof openWindow != "undefined"){
    openWindow.close();
  }
  infowindow.open(map, marker);
  openWindow = infowindow
}

function shelterIconName(shelter){
  if(shelter.beds > 10){
    var iconName = "/img/red10+.png"
  } else {
    iconName = "/img/" + "red" + shelter.beds + ".png"
  }
  return iconName
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

function addInfoWindow(contentString, marker){
  var infowindow = new google.maps.InfoWindow({
    content: contentString
  })
  google.maps.event.addListener(marker, 'click', function(){openSoloWindow(infowindow, marker)});
}

function loadShelterMarker(shelter){
  marker = makeMarker(shelter, shelterIconName(shelter))
  shelterMarkerObjects[shelter.name] = marker

  var contentString = shelterDetails(shelter);
  addInfoWindow(contentString, marker)
}

function loadEventMarker(evnt){
  marker = makeMarker(evnt, '/img/blue.png')
  eventMarkerObjects[evnt.name] = marker

  var contentString = eventDetails(evnt);
  addInfoWindow(contentString, marker)
}

function loadMealMarker(meal){
  marker = makeMarker(meal, '/img/mealMarker.png')
  mealMarkerObjects[meal.name] = marker

  var contentString = mealDetails(meal);
  addInfoWindow(contentString, marker)
}

function loadClothMarker(cloth){
  marker = makeMarker(cloth, '/img/clothMarker.png')
  clothMarkerObjects[cloth.name] = marker

  var contentString = clothDetails(cloth);
  addInfoWindow(contentString, marker)
}

function shelterDetails(shelter){
  var contentString = "<div id='wrapper' style='width: 100%; height: 110%; font-size: 20px'><div id='name', style='font-size: 24px; font-weight:bold' >"+ shelter.name + "</div><div id='phone'>" + shelter.phone + "</div>" + "<div id='hours'> Open: " + shelter.hours.open + "   Close: " + shelter.hours.close + "</div>" + "<a href=" + shelter.url + ">"+ shelter.url+ "</a><br/><div style='font-size:12px'>Last updated:" + new Date(shelter.updatedAt).toString() +"</div>"

  if(shelter.facilities.shower == true){
    contentString += ("<img style='margin:5px' src='/img/shower.png'>")
  }
  if(shelter.facilities.wifi == true){
    contentString += ("<img style='margin:5px' src='/img/wifi.png'>")
  }
  if(shelter.facilities.pets == true){
    contentString += ("<img style='margin:5px' src='/img/pets.png'>")
  }
  if(shelter.facilities.food == true){
    contentString += ("<img style='margin:5px' src='/img/food.png'>")
  }
  return contentString + "</div>"
}

function eventDetails(evnt){
  var contentString = "<div id='wrapper'><div id='event-name', style='font-size: 24px; font-weight:bold'>"+ evnt.name + "</div><div id='event-desc'>" + evnt.description + "</div><div id='event-location', style='font-size:18px;'>" + evnt.location + "</div></div id='event-date'>" + evnt.date + "</div><div id='event-time'>" + evnt.time
  if (evnt.url){
    contentString+= '<br/><a href=' + evnt.url + ">" + evnt.url + "</a>"
  }

  return contentString
}

function mealDetails(meal){
  var contentString = "<div id='wrapper'><div id='meal-name', style='font-size: 24px; font-weight:bold'>"+ meal.name + "</div><div id='meal-phone'>" + meal.phone + "</div><div id='meal-address', style='font-size:18px;'>" + meal.address + "</div></div id='meal-hours'>" + meal.hours //+ "</div><div id='event-time'>" + meal.time
  if (meal.url){
    contentString+= '<br/><a href=' + meal.url + ">" + meal.url + "</a>"
  }

  return contentString
}

function clothDetails(cloth){
  var contentString = "<div id='wrapper'><div id='cloth-name', style='font-size: 24px; font-weight:bold'>"+ cloth.name + "</div><div id='cloth-phone'>" + cloth.phone + "</div><div id='cloth-address', style='font-size:18px;'>" + cloth.address + "</div></div id='cloth-hours'>" + cloth.hours //+ "</div><div id='event-time'>" + cloth.time
  if (cloth.url){
    contentString+= '<br/><a href=' + cloth.url + ">" + cloth.url + "</a>"
  }

  return contentString
}

sheltersFirebaseRef.once('value', function(dataSnapshot){
  dataSnapshot.forEach(function(child){
    loadShelterMarker(child.val());
  });
});

eventsFirebaseRef.once('value', function(dataSnapshot){
  dataSnapshot.forEach(function(child){
    loadEventMarker(child.val());
  });
});

mealsFirebaseRef.once('value', function(dataSnapshot){
  dataSnapshot.forEach(function(child){
    loadMealMarker(child.val());
  });
});

clothFirebaseRef.once('value', function(dataSnapshot){
  dataSnapshot.forEach(function(child){
    loadClothMarker(child.val());
  });
});

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

var showShelters = true;
var showEvents = true;
var showMeals = true;
var showCloth = true;

function toggleShelters(){
  showShelters = !showShelters;
  sheltersFirebaseRef.once('value', function(dataSnapshot){
    dataSnapshot.forEach(function(child){
      shelter = child.val();
      var marker = shelterMarkerObjects[shelter.name];
      marker.setVisible(showShelters);
    });
  });
}

function toggleEvents(){
  showEvents = !showEvents;
  eventsFirebaseRef.once('value', function(dataSnapshot){
    dataSnapshot.forEach(function(child){
      evnt = child.val();
      var marker = eventMarkerObjects[evnt.name];
      marker.setVisible(showEvents);
    });
  });
}

function toggleMeals(){
  showMeals = !showMeals;
  mealsFirebaseRef.once('value', function(dataSnapshot){
    dataSnapshot.forEach(function(child){
      meal = child.val();
      var marker = mealMarkerObjects[meal.name];
      marker.setVisible(showMeals);
    });
  });
}

function toggleClothing(){
  showCloth = !showCloth;
  clothFirebaseRef.once('value', function(dataSnapshot){
    dataSnapshot.forEach(function(child){
      cloth = child.val();
      var marker = clothMarkerObjects[cloth.name];
      marker.setVisible(showCloth);
    });
  });
}


$("#bedCountSubmit").click(function(event){
  event.preventDefault();

  var updatedBedCountInput = $("#inputBedCount").val();
  var beds = sheltersFirebaseRef.child("shelterInfo00");

  beds.update({
    "beds": updatedBedCountInput,
    "updatedAt": Firebase.ServerValue.TIMESTAMP
  });

  $('#bedCountForm').modal('hide');
  $('#shelterLogin').modal('hide');
});


function overlay() {
  el = document.getElementById("overlay");
  el.style.visibility = (el.style.visibility == "visible") ? "hidden" : "visible";
}
