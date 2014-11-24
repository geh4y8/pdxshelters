

var map;

// Set the center as Firebase HQ
var locations = {
  "PDXSheltersHQ": [45.531436, -122.655222]
};
var center = locations["PDXSheltersHQ"];

// Query radius
var radiusInKm = 1;

// Get a reference to the Firebase public transit open data set
var sheltersFirebaseRef = new Firebase("https://pdxshelters.firebaseio.com/shelters");
var eventsFirebaseRef = new Firebase("https://pdxshelters.firebaseio.com/events");
var mealsFirebaseRef = new Firebase("https://pdxshelters.firebaseio.com/meals");
var clothFirebaseRef = new Firebase("https://pdxshelters.firebaseio.com/clothing");

sheltersFirebaseRef.on("child_changed", function(snapshot) {
  var changedShelter = snapshot.val();
  var marker = shelterMarkerObjects[changedShelter.name];
  marker.setIcon(shelterIconName(changedShelter));
})

sheltersFirebaseRef.on("child_added", function(snapshot) {
  var newShelter = snapshot.val();
})


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
  }else{
    iconName = "/img/"+"red"+shelter.beds + ".png"
  }
  return iconName
}

function loadShelterMarker(shelter){
  // To add the marker to the map, use the 'map' property
  var coords = shelter.coords.l
  var shelterLatLong = new google.maps.LatLng(coords[0], coords[1]);
  var marker = new google.maps.Marker({
      position: shelterLatLong,
      map: map,
      icon: shelterIconName(shelter)
  });

  shelterMarkerObjects[shelter.name] = marker

  var contentString = shelterDetails(shelter);
  var infowindow = new google.maps.InfoWindow({
    content: contentString
  })
  google.maps.event.addListener(marker, 'click', function(){openSoloWindow(infowindow, marker)});
}

function loadEventMarker(evnt){
  var coords = evnt.coords.l
  var eventLatLong = new google.maps.LatLng(coords[0], coords[1]);
  var marker = new google.maps.Marker({
      position: eventLatLong,
      map: map,
      icon:'/img/blue.png'
  });

  eventMarkerObjects[evnt.name] = marker

  var contentString = eventDetails(evnt);
  var infowindow = new google.maps.InfoWindow({
    content: contentString
  })

  google.maps.event.addListener(marker, 'click', function(){openSoloWindow(infowindow, marker)});
}

function loadMealMarker(meal){
  var coords = meal.coords.l
  var mealLatLong = new google.maps.LatLng(coords[0], coords[1]);
  var marker = new google.maps.Marker({
      position: mealLatLong,
      map: map,
      icon:'/img/mealMarker.png'
  });

  mealMarkerObjects[meal.name] = marker

  var contentString = mealDetails(meal);
  var infowindow = new google.maps.InfoWindow({
    content: contentString
  })

  google.maps.event.addListener(marker, 'click', function(){openSoloWindow(infowindow, marker)});
}

function loadClothMarker(cloth){
  var coords = cloth.coords.l
  var clothLatLong = new google.maps.LatLng(coords[0], coords[1]);
  var marker = new google.maps.Marker({
      position: clothLatLong,
      map: map,
      icon:'/img/clothMarker.png'
  });

  clothMarkerObjects[cloth.name] = marker

  var contentString = clothDetails(cloth);
  var infowindow = new google.maps.InfoWindow({
    content: contentString
  })

  google.maps.event.addListener(marker, 'click', function(){openSoloWindow(infowindow, marker)});
}

function shelterDetails(shelter){
  //console.log(shelter)
  var contentString = "<div id='wrapper' style='width: 100%; height: 110%; font-size: 20px'><div id='name', style='font-size: 24px; font-weight:bold' >"+ shelter.name + "</div><div id='phone'>" + shelter.phone + "</div>" + "<div id='hours'> Open: " + shelter.hours.open + "   Close: " + shelter.hours.close + "</div>" + "<a href=" + shelter.url + ">"+ shelter.url+ "</a><br/><div style='font-size:12px'>Last updated: 11-16-1014 18:28</div>"

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

sheltersFirebaseRef.on('value', function(dataSnapshot){
  dataSnapshot.forEach(function(child){
    loadShelterMarker(child.val())
  })
})

eventsFirebaseRef.on('value', function(dataSnapshot){
  dataSnapshot.forEach(function(child){
    loadEventMarker(child.val())
  })
})

mealsFirebaseRef.on('value', function(dataSnapshot){
  dataSnapshot.forEach(function(child){
    loadMealMarker(child.val())
  })
})

clothFirebaseRef.on('value', function(dataSnapshot){
  dataSnapshot.forEach(function(child){
    loadClothMarker(child.val())
  })
})

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

var showShelters = 1;
var showEvents = 1;
var showMeals = 1;
var showCloth = 1;

function toggleShelters(){
  showShelters = !showShelters
  if (showShelters){
    sheltersFirebaseRef.on('value', function(dataSnapshot){
      dataSnapshot.forEach(function(child){
        shelter = child.val()
        var marker = shelterMarkerObjects[shelter.name];
        marker.setVisible(true)
      })})
  }else{
    sheltersFirebaseRef.on('value', function(dataSnapshot){
      dataSnapshot.forEach(function(child){
        shelter = child.val()
        var marker = shelterMarkerObjects[shelter.name];
        marker.setVisible(false)
      })})
  }
}

function toggleEvents(){
  showEvents = !showEvents
  if (showEvents){
    eventsFirebaseRef.on('value', function(dataSnapshot){
      dataSnapshot.forEach(function(child){
        evnt = child.val()
        var marker = eventMarkerObjects[evnt.name];
        marker.setVisible(true)
      })})
  }else{
    eventsFirebaseRef.on('value', function(dataSnapshot){
      dataSnapshot.forEach(function(child){
        evnt = child.val()
        var marker = eventMarkerObjects[evnt.name];
        marker.setVisible(false)
      })})
  }
}

function toggleMeals(){
  showMeals = !showMeals
  if (showMeals){
    mealsFirebaseRef.on('value', function(dataSnapshot){
      dataSnapshot.forEach(function(child){
        meal = child.val()
        var marker = mealMarkerObjects[meal.name];
        marker.setVisible(true)
      })})
  }else{
    mealsFirebaseRef.on('value', function(dataSnapshot){
      dataSnapshot.forEach(function(child){
        meal = child.val()
        var marker = mealMarkerObjects[meal.name];
        marker.setVisible(false)
      })})
  }
}

function toggleClothing(){
  showCloth = !showCloth
  if (showCloth){
    clothFirebaseRef.on('value', function(dataSnapshot){
      dataSnapshot.forEach(function(child){
        cloth = child.val();
        var marker = clothMarkerObjects[cloth.name];
        marker.setVisible(true);
      })});
  }else{
    clothFirebaseRef.on('value', function(dataSnapshot){
      dataSnapshot.forEach(function(child){
        cloth = child.val();
        var marker = clothMarkerObjects[cloth.name];
        marker.setVisible(false);
      })});
  }
}

function overlay() {
  el = document.getElementById("overlay");
  console.log("Setting visibility to: ", (el.style.visibility == "visible") ? "hidden" : "visible")
  el.style.visibility = (el.style.visibility == "visible") ? "hidden" : "visible";
}
