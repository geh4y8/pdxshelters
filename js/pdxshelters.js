

var map;

// Set the center as Firebase HQ
var locations = {
  "PDXSheltersHQ": [45.531436, -122.655222]
};
var center = locations["PDXSheltersHQ"];

// Query radius
var radiusInKm = 1;

// Get a reference to the Firebase public transit open data set
var sheltersFirebaseRef = new Firebase("https://pdxshelters.firebaseio.com/shelters")
var eventsFirebaseRef = new Firebase("https://pdxshelters.firebaseio.com/events")

//console.log(sheltersFirebaseRef.child('pdxshelters'))


sheltersFirebaseRef.on("child_changed", function(snapshot) {
  var changedShelter = snapshot.val();
  console.log("The updated shelter has " + changedShelter.beds + " beds");
  console.log(changedShelter.name)
  var marker = shelterMarkerObjects[changedShelter.name];
  // for(var key in shelterMarkerObjects){
  //   shelterMarkerObjects[key] = null
  // }
  marker.setIcon(shelterIconName(changedShelter))
})

sheltersFirebaseRef.on("child_added", function(snapshot) {
  var newShelter = snapshot.val();
  console.log("There is a new Shelter in town! It is called " + newShelter.name + " and it is located at " + newShelter.location + " and they have " + newShelter.beds + " beds!");
})


//Create a new GeoFire instance
var geoFire = new GeoFire(sheltersFirebaseRef);
var shelterMarkerObjects = {};
var eventMarkerObjects = {};

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
  google.maps.event.addListener(marker, 'click', function() {
    infowindow.open(map, marker)
  });
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

  google.maps.event.addListener(marker, 'click', function() {
    infowindow.open(map, marker)
  });
}

function shelterDetails(shelter){
  //console.log(shelter)
  var contentString = "<div id='wrapper' style='width: 100%; height: 110%; font-size: 20px'><div id='name'>"+ shelter.name + "</div><div id='phone'>" + shelter.phone + "</div>" + "<div id='hours'> Open: " + shelter.hours.open + "   Close: " + shelter.hours.close + "</div>" + "<a href=" + shelter.url + ">"+ shelter.url+ "</a><br/>"

  if(shelter.facilities.shower == true){
    contentString += ("<img src='/img/shower.png'>")
  }
  if(shelter.facilities.wifi == true){
    contentString += ("<img src='/img/wifi.png'>")
  }
  if(shelter.facilities.pets == true){
    contentString += ("<img src='/img/pets.png'>")
  }
  if(shelter.facilities.food == true){
    contentString += ("<img src='/img/food.png'>")
  }
  return contentString + "</div>"
}

function eventDetails(evnt){
  var contentString = "<div id='wrapper' style='width: 100%; height: 110%; font-size: 20px'><div id='name'>"+ evnt.name + "</div><div id='desc'>" + evnt.description + "</div><div id='location'>" + evnt.location + "</div></div id='event-date'>" + evnt.date + "</div><div id='event-time'>" + evnt.time
  if (evnt.url){
    contentString+= '<br/><a href=' + evnt.url + ">" + evnt.url + "</a>"
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




/***************/
/*  GEOLOCATE  */
/***************/
// Get the location of the user, re-intialize map to that location
// navigator.geolocation.getCurrentPosition(getUserPosition, function(error){console.log("Error with user location:", error.message)})
//
// function getUserPosition(position){
//     center = [position.coords.latitude, position.coords.longitude];
//     locations["PDXSheltersHQ"] = center
//     console.log("Found user location : ", center)
//     initializeMap()
// }


/*****************/
/*  GOOGLE MAPS  */
/*****************/
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

/**********************/
/*  HELPER FUNCTIONS  */
/**********************/
/* Adds a marker for the inputted shelter to the map */
function createShelterMarker(shelter) {
  var marker = new google.maps.Marker({
    icon: "https://chart.googleapis.com/chart?chst=d_bubble_icon_text_small&chld=" + vehicle.vtype + "|bbT|" + vehicle.routeTag + "|" + vehicleColor + "|eee",
    position: new google.maps.LatLng(shelter.lat, shelter.lon),
    optimized: true,
    map: map
  });

  return marker;
}

var showShelters = 1
var showEvents = 1

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


(function() {

  'use strict';

  document.querySelector('.material-design-hamburger__icon').addEventListener(
    'click',
    function() {
      var child;

      document.body.classList.toggle('background--blur');
      this.parentNode.nextElementSibling.classList.toggle('menu--on');

      child = this.childNodes[1].classList;

      if (child.contains('material-design-hamburger__icon--to-arrow')) {
        child.remove('material-design-hamburger__icon--to-arrow');
        child.add('material-design-hamburger__icon--from-arrow');
      } else {
        child.remove('material-design-hamburger__icon--from-arrow');
        child.add('material-design-hamburger__icon--to-arrow');
      }

    });

})();
