

var map;

// Set the center as Firebase HQ
var locations = {
  "PDXSheltersHQ": [45.531190, -122.680241]
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
  var marker = markerObject[changedShelter.name];
  // for(var key in markerObject){
  //   markerObject[key] = null
  // }
  if(changedShelter.beds > 10){
    marker.setIcon("/img/no10+.png")
  }else if(changedShelter.beds === 0){

  }else{
    marker.setIcon("/img/"+"no"+changedShelter.beds + ".png")
  }
})

sheltersFirebaseRef.on("child_added", function(snapshot) {
  var newShelter = snapshot.val();
  console.log("There is a new Shelter in town! It is called " + newShelter.name + " and it is located at " + newShelter.location + " and they have " + newShelter.beds + " beds!")
})


//Create a new GeoFire instance
var geoFire = new GeoFire(sheltersFirebaseRef)
var markerObject = {};

function loadShelterMarker(shelter){
  // To add the marker to the map, use the 'map' property
  var coords = shelter.coords.l
  var shelterLatLong = new google.maps.LatLng(coords[0], coords[1]);
  if(shelter.beds > 10){
    var iconName = "/img/no10+.png"
  }else if(shelter.beds === 0){

  }else{
    iconName = "/img/"+"no"+shelter.beds + ".png"
  }
  var marker = new google.maps.Marker({
      position: shelterLatLong,
      map: map,
      icon: iconName
  });

  markerObject[shelter.name] = marker

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
  });

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
  console.log(shelter.facilities.pets)
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
  var contentString = "<div id='wrapper' style='width: 100%; height: 110%; font-size: 20px'><div id='name'>"+ evnt.name + "</div><div id='desc'>" + evnt.description + "</div><div id='location'>" + evnt.location + "</div>"
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

// geoFire.set("coords", [45.521450, -122.653635]).then(function(){
//   console.log("key has been added");
// }, function(error) {
//   console.log("Error: " + error);
// })
// var shelters = sheltersFirebaseRef.once(function(childSnapshot){
//   console.log(childSnapshot)
// })

// sheltersFirebaseRef.on('value', function(dataSnapshot){
//   //console.log(dataSnapshot)
//   dataSnapshot.forEach(function(childSnapshot){
//     // var shelterLatitude = childSnapshot.val().coords.l
//     // console.log(shelterLatitude)
//     // var shelterLongitude = childSnapshot.val().coords.l[1]
//     console.log(childSnapshot.val())
// var geoFire1;
// var geoFire2;
// var geoFire3;
// var geoFire4;
// var geoFire5;
// var geoFire6;
// var geoFire7;
// var geoQuery1;
// var geoQuery2;
// var geoQuery3;
// var geoQuery4;
// var geoQuery5;
// var geoQuery6;
// var geoQuery7;
//
// function getShelters(){
//     geoFire1 = new GeoFire(sheltersFirebaseRef.child("testShelter1"))
//       geoFire1.get("coords").then(function(location) {
//         if (location === null) {
//           console.log("Provided key is not in GeoFire");
//         }
//         else {
//           // console.log("Provided key has a location of " + location);
//           geoQuery1 = geoFire1.query({
//             center: center,
//             radius: radiusInKm
//           });
//           var onKeyEnteredRegistration1 = geoQuery1.on("key_entered", function(key, location, distance){
//             // console.log("key:"+ key +" location: " + location + " distance: " + distance)
//           })
//         }
//       }, function(error) {
//         console.log("Error: " + error);
//       });
//
//       geoFire2 = new GeoFire(sheltersFirebaseRef.child("testShelter2"))
//         geoFire2.get("coords").then(function(location) {
//           if (location === null) {
//             console.log("Provided key is not in GeoFire");
//           }
//           else {
//             // console.log("Provided key has a location of " + location);
//               geoQuery2 = geoFire2.query({
//               center: center,
//               radius: radiusInKm
//             });
//             var onKeyEnteredRegistration2 = geoQuery2.on("key_entered", function(key, location, distance){
//               // console.log("key:"+ key +" location: " + location + " distance: " + distance)
//             })
//           }
//         }, function(error) {
//           console.log("Error: " + error);
//         });
//
//
//       geoFire3 = new GeoFire(sheltersFirebaseRef.child("testShelter3"))
//         geoFire3.get("coords").then(function(location) {
//           if (location === null) {
//             console.log("Provided key is not in GeoFire");
//           }
//           else {
//             console.log("Provided key has a location of " + location);
//               geoQuery3 = geoFire3.query({
//               center: center,
//               radius: radiusInKm
//             });
//             var onKeyEnteredRegistration3 = geoQuery3.on("key_entered", function(key, location, distance){
//               // console.log("key:"+ key +" location: " + location + " distance: " + distance)
//             })
//           }
//         }, function(error) {
//           console.log("Error: " + error);
//         });
//
//       geoFire4 = new GeoFire(sheltersFirebaseRef.child("testShelter2"))
//         geoFire4.get("coords").then(function(location) {
//           if (location === null) {
//             console.log("Provided key is not in GeoFire");
//           }
//           else {
//             console.log("Provided key has a location of " + location);
//             geoQuery4 = geoFire4.query({
//               center: [45.51744,-122.693425],
//               radius: radiusInKm
//             });
//             var onKeyEnteredRegistration4 = geoQuery4.on("key_entered", function(key, location, distance){
//               console.log("key:"+ key +" location: " + location + " distance: " + distance)
//               var myLatlng = new google.maps.LatLng(45.51744,-122.693425);
//
//               // To add the marker to the map, use the 'map' property
//               var marker = new google.maps.Marker({
//                   position: myLatlng,
//                   map: map,
//                   title:"Hello World!"
//               });
//             })
//           }
//         }, function(error) {
//           console.log("Error: " + error);
//         });
// }
//
//
//
//
// var geoRef = geoFire.ref();
//
// /*************/
// /*  GEOQUERY */
// /*************/
// // Keep track of all of the shelters currently within the query
// var sheltersInQuery = {};
//
// // Create a new GeoQuery instance
// var geoQuery = geoFire.query({
//   center: center,
//   radius: radiusInKm
// });
//
// var onReadyRegistration = geoQuery.on("ready", function() {
//   console.log("geoquery has loaded and fired all queries")
//   getShelters();
// })
//
// var onKeyEnteredRegistration1 = geoQuery1.on("key_entered", function(key, location, distance){
//
//   // console.log(key +" " + location+ " " + distance)
// })
// var onKeyEnteredRegistration2 = geoQuery2.on("key_entered", function(key, location, distance){
//   // console.log(key +" " + location+ " " + distance)
// })
// var onKeyEnteredRegistration3 = geoQuery3.on("key_entered", function(key, location, distance){
//   // console.log(key +" " + location+ " " + distance)
// })
// var onKeyEnteredRegistration4 = geoQuery4.on("key_entered", function(key, location, distance){
//   // console.log(key +" " + location+ " " + distance)
// })




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

  // Create a draggable circle centered on the map
  // var circle = new google.maps.Circle({
  //   strokeColor: "#6D3099",
  //   strokeOpacity: 0.7,
  //   strokeWeight: 1,
  //   fillColor: "#B650FF",
  //   fillOpacity: 0.35,
  //   map: map,
  //   center: loc,
  //   radius: ((radiusInKm) * 1000),
  //   draggable: true
  // });

  //Update the query's criteria every time the circle is dragged
//   var updateCriteria = _.debounce(function() {
//
//     var latLng = circle.getCenter();
//     center = [latLng.lat(), latLng.lng()]
//     geoQuery.updateCriteria({
//       center: center,
//       radius: radiusInKm
//     });
//   }, 10);
//   google.maps.event.addListener(circle, "drag", updateCriteria);
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
