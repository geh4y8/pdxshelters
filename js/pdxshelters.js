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

console.log(sheltersFirebaseRef.child('pdxshelters/testShelter/beds'))

sheltersFirebaseRef.on("child_changed", function(snapshot) {
  var changedShelter = snapshot.val();
  console.log("The updated shelter has " + changedShelter.beds + " beds")
})

sheltersFirebaseRef.on("child_added", function(snapshot) {
  var newShelter = snapshot.val();
  console.log("There is a new Shelter in town! It is called " + newShelter.name + " and it is located at " + newShelter.location + " and they have " + newShelter.beds + " beds!")
})


// Create a new GeoFire instance, pulling data from the public transit data
var geoFire = new GeoFire(sheltersFirebaseRef.child("_geofire"));

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
  google.maps.event.addListener(circle, "drag", updateCriteria);
}

/**********************/
/*  HELPER FUNCTIONS  */
/**********************/
/* Adds a marker for the inputted shelter to the map */
function createShelterMarker(shelter) {
  var marker = new google.maps.Marker({

    
    optimized: true,
    map: map
  });

  return marker;
}

/* Returns a blue color code for outbound vehicles or a red color code for inbound vehicles */
function getVehicleColor(vehicle) {
  return ((vehicle.dirTag && vehicle.dirTag.indexOf("OB") > -1) ? "50B1FF" : "FF6450");
}

/* Returns true if the two inputted coordinates are approximately equivalent */
function coordinatesAreEquivalent(coord1, coord2) {
  return (Math.abs(coord1 - coord2) < 0.000001);
}

/* Animates the Marker class (based on https://stackoverflow.com/a/10906464) */
google.maps.Marker.prototype.animatedMoveTo = function(newLocation) {
  var toLat = newLocation[0];
  var toLng = newLocation[1];

  var fromLat = this.getPosition().lat();
  var fromLng = this.getPosition().lng();

  if (!coordinatesAreEquivalent(fromLat, toLat) || !coordinatesAreEquivalent(fromLng, toLng)) {
    var percent = 0;
    var latDistance = toLat - fromLat;
    var lngDistance = toLng - fromLng;
    var interval = window.setInterval(function () {
      percent += 0.01;
      var curLat = fromLat + (percent * latDistance);
      var curLng = fromLng + (percent * lngDistance);
      var pos = new google.maps.LatLng(curLat, curLng);
      this.setPosition(pos);
      if (percent >= 1) {
        window.clearInterval(interval);
      }
    }.bind(this), 50);
  }
};
