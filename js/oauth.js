$(document).ready(function(){

  var ref = new Firebase("https://pdxshelters.firebaseio.com/")

  var googleOauth = $('#shelterLoginBtn')

  $('#googleOauth').click(function(){
    ref.authWithOAuthPopup("google", function(error, authData) {
      if (error) {
        if (error.code === "TRANSPORT_UNAVAILABLE") {
          // fall-back to browser redirects, and pick up the session
          // automatically when we come back to the origin page
          ref.authWithOAuthRedirect("google", function(error, authData) {
            if (error){
              console.log("there was an error logging in", error)
            } else{
              console.log("successfully logged in!", authData)
            }
          });
        }
      } else if(authData) {
        console.log('Authenticated successfully', authData)
      }
    });
    $('#googleOauth').html("logged in").addClass("disabled").removeClass('btn-danger');
    $('#guestForm').removeClass("hidden");
    $('#bedCountBtn').removeClass("hidden");
  });
})
