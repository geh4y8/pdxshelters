

var map;

// Set the center as Firebase HQ
var locations = {
  "PDXSheltersHQ": [45.516579, -122.672506]
};
var center = locations["PDXSheltersHQ"];

// Query radius
var radiusInKm = 1;

// Get a reference to the Firebase public transit open data set
var sheltersFirebaseRef = new Firebase("https://pdxshelters.firebaseio.com/")

console.log(sheltersFirebaseRef.child('pdxshelters'))

sheltersFirebaseRef.on("child_changed", function(snapshot) {
  var changedShelter = snapshot.val();
  console.log("The updated shelter has " + changedShelter.beds + " beds")
})

sheltersFirebaseRef.on("child_added", function(snapshot) {
  var newShelter = snapshot.val();
  console.log("There is a new Shelter in town! It is called " + newShelter.name + " and it is located at " + newShelter.location + " and they have " + newShelter.beds + " beds!")
})


//Create a new GeoFire instance
var geoFire = new GeoFire(sheltersFirebaseRef);

// geoFire.set("coords", [45.521450, -122.653635]).then(function(){
//   console.log("key has been added");
// }, function(error) {
//   console.log("Error: " + error);
// })
sheltersFirebaseRef.forEach(function(childSnapshot){
  console.log(childSnapshot)
  // geoFire.get(childSnapshot["coords"]).then(function(location) {
  //   if (location === null) {
  //     console.log("Provided key is not in GeoFire");
  //   }
  //   else {
  //     console.log("Provided key has a location of " + location);
  //     var onKeyEnteredRegistration = geoQuery.on("key_entered", function(key, location, distance){
  //       console.log(key +" " + location+ " " + distance)
  //     })
  //   }
  // }, function(error) {
  //   console.log("Error: " + error);
  // });
});
var geoRef = geoFire.ref();

/*************/
/*  GEOQUERY */
/*************/
// Keep track of all of the shelters currently within the query
var sheltersInQuery = {};

// Create a new GeoQuery instance
var geoQuery = geoFire.query({
  center: center,
  radius: radiusInKm
});

<<<<<<< HEAD
var onReadyRegistration = geoQuery.on("ready", function() {
  console.log("geoquery has loaded and fired all queries")
})

var onKeyEnteredRegistration = geoQuery.on("key_entered", function(key, location, distance){
  console.log(key +" " + location+ " " + distance)
})




/***************/
/*  GEOLOCATE  */
/***************/
// Get the location of the user, re-intialize map to that location
navigator.geolocation.getCurrentPosition(getUserPosition, function(error){console.log("Error with user location:", error.message)})

function getUserPosition(position){
    center = [position.coords.latitude, position.coords.longitude];
    locations["PDXSheltersHQ"] = center
    console.log("Found user location : ", center)
    initializeMap()
}


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
    zoom: 15,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  });
  
  // Create Marker
  var myMarker = new google.maps.Marker({
    position: loc,
    map: map,
    title: 'I am here!'
  });

  // Create a draggable circle centered on the map
  var circle = new google.maps.Circle({
    strokeColor: "#6D3099",
    strokeOpacity: 0.7,
    strokeWeight: 1,
    fillColor: "#B650FF",
    fillOpacity: 0.35,
    map: map,
    center: loc,
    radius: ((radiusInKm) * 1000),
    draggable: true
  });

  //Update the query's criteria every time the circle is dragged
  var updateCriteria = _.debounce(function() {
    var latLng = circle.getCenter();
    geoQuery.updateCriteria({
      center: [latLng.lat(), latLng.lng()],
      radius: radiusInKm
    });
  }, 10);
  google.maps.event.addListener(circle, "drag", updateCriteria);// TEST CALL: NOT NEEDED IN FINAL CODE
  console.log("PopulateShelterMarkers call....");
  populateShelterMarkers(map);

}; //End of initializeMap()



/****
 *  SHELTER MARKER ADDITION TEST HUB
 * *****************/
function populateShelterMarkers(myMap) {
console.log("Begin function populateShelterMarkers....");
var firstShelterLoc = new google.maps.LatLng(45.516, -122.682);
var firstShelterName = "Shelter One";

var secondShelterLoc = new google.maps.LatLng(45.517, -122.6626);
var secondShelterName = "Shelter Two";

createShelterMarker(firstShelterLoc, firstShelterName, myMap);
createShelterMarker(secondShelterLoc, secondShelterName, myMap);
};

/**********************/
/*  MARKER FUNCTIONS  */
/**********************/


/* Creates a marker for the inputted shelter to the map */
//function createShelterMarker(shelter) {
//Shelter Marker Image
var bedImage = 'images/bed.png';


/* Places a single Shelter Marker on the Map */
function createShelterMarker(shelterLoc, shelterName, curMap) {
  console.log("Begin function createShelterMarker....");

  // Create the marker 
  var shelterMarker = new google.maps.Marker({ 
      position: shelterLoc,
      title: shelterName,
      map: curMap,
      icon: bedImage });

  // Add marker to map
  shelterMarker.setMap(curMap);
}

// /* Returns a blue color code for outbound vehicles or a red color code for inbound vehicles */
// function getVehicleColor(vehicle) {
//   return ((vehicle.dirTag && vehicle.dirTag.indexOf("OB") > -1) ? "50B1FF" : "FF6450");
// }
//
// /* Returns true if the two inputted coordinates are approximately equivalent */
// function coordinatesAreEquivalent(coord1, coord2) {
//   return (Math.abs(coord1 - coord2) < 0.000001);
// }

/* Animates the Marker class (based on https://stackoverflow.com/a/10906464) */
// google.maps.Marker.prototype.animatedMoveTo = function(newLocation) {
//   var toLat = newLocation[0];
//   var toLng = newLocation[1];
//
//   var fromLat = this.getPosition().lat();
//   var fromLng = this.getPosition().lng();
//
//   if (!coordinatesAreEquivalent(fromLat, toLat) || !coordinatesAreEquivalent(fromLng, toLng)) {
//     var percent = 0;
//     var latDistance = toLat - fromLat;
//     var lngDistance = toLng - fromLng;
//     var interval = window.setInterval(function () {
//       percent += 0.01;
//       var curLat = fromLat + (percent * latDistance);
//       var curLng = fromLng + (percent * lngDistance);
//       var pos = new google.maps.LatLng(curLat, curLng);
//       this.setPosition(pos);
//       if (percent >= 1) {
//         window.clearInterval(interval);
//       }
//     }.bind(this), 50);
//   }
// };
