$(document).ready(function () {
    var authData = baseFirebaseRef.getAuth();  
    if (authData) {
      console.log("User " + authData.password.Email + " is logged in with " + authData.provider);
      $("#logoutLink").css('display', 'inline-block');
      $("#addLink").css('display', 'inline-block');
    
    } else {
      console.log("User not logged in")
      $("#loginLink").css('display', 'inline-block');
    }
    
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
  if (!mapitem.hasOwnProperty('coords')) {
    console.log("no location for", mapitem.name);
    return
  }
  if (name in primary_filters) {
    var iconpath = primary_filters[name];
   } else {
    var iconpath = other_icon;
  }
  var marker = makeMarker(mapitem, iconpath);
  marker.setVisible(showFilters[name]);
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

$("#loginSubmit").click(function(event){
  event.preventDefault();

  baseFirebaseRef.authWithPassword({
    email: $("#loginEmail").val(),
    password: $("#loginPassword").val()
  }, function(error, authData) {
    $("#login-warn").remove()
    if (error) {
      console.log("Login Failed!", error);
      var loginPane = $("#login");
      loginPane.append('<p id="login-warn">Email address and/or password incorrect</p>');
    } else {
      console.log("Authenticated successfully with payload:", authData);
      // $("#login").removeClass("active");
      // $("#addMapItem").addClass("active").fadeIn("slow");
      $("#shelterLogin").modal('hide');
      $("#loginLink").hide();
      $("#logoutLink").css('display', 'inline-block');
      $("#addLink").css('display', 'inline-block');

    }
  });
});

$("#forgotPasswordSubmit").click(function(event){
  event.preventDefault();

  baseFirebaseRef.resetPassword({
      email : $("#forgotEmail").val()
    }, function(error) {
    if (error === null) {
      console.log("Password reset email sent successfully");
    } else {
      console.log("Error sending password reset email:", error);
    }
  });
});

$("#mapItemSubmit").click(function(event){
  event.preventDefault();

  var authData = baseFirebaseRef.getAuth();  
  if (authData) {
    console.log("Save stuff here");
  } else {
    console.log("User is logged out");
  }

});

$("#logoutLink").click(function(event){
  event.preventDefault();

  baseFirebaseRef.unauth();
  $("#loginLink").css('display', 'inline-block');
  $("#logoutLink").hide();
  $("#addLink").hide()
});

/* Initialize Map with markers */
var map;

// Set the center as Firebase HQ
var locations = {
  "PDXSheltersHQ": [45.531436, -122.655222]
};
var center = locations["PDXSheltersHQ"];

var primary_filters = {'shelters': '/img/shelterMarker.png', 
                       'meals': '/img/mealMarker.png', 
                       'clothing': '/img/clothMarker.png'};
                       
var other_filters = ['healthcare', 'legal'];
var other_icon = '/img/otherMarker.png';

var filters = Object.keys(primary_filters).concat(other_filters);

// add other filters to nav menu
for (var ifilter in other_filters) {
  $('#extra-filter-menu').append('<li><input type="checkbox" role="menuitem" id="' + 
                                 other_filters[ifilter] + 
                                 '" onclick="toggleFilter(this.id)">' + other_filters[ifilter] + 
                                 '</li>');
}

// Get references to the Firebase data sets
var firebaseRefs = {};
var showFilters = {};
var markerObjects = {};
for (var ifilter in filters) {
  filter = filters[ifilter];
  firebaseRefs[filter]= new Firebase("https://pdxshelters.firebaseio.com/" + filter);
  showFilters[filter] = true;
  markerObjects[filter] = {};
}

// do not show additional filters on load
for (var ifilter in other_filters) {
  showFilters[other_filters[ifilter]] = false;
}

var baseFirebaseRef = new Firebase("https://pdxshelters.firebaseio.com");

// Add a marker to the map for each item in the DB
for (var ref in firebaseRefs){
  firebaseRefs[ref].once('value', function(dataSnapshot){
    dataSnapshot.forEach(function(child){
      loadMarker(dataSnapshot.key(), child.val());
    });
  });
}

var openWindow;
