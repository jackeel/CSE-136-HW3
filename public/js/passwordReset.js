window.onload = function() {

/*************************** AJAX **********************************/
//Change Password
$("#resetPassword").on("submit", function (event) {
 event.preventDefault();
 window.location.hash = "";
 var url = '/passwordReset';
 var params = JSON.stringify({
   "password" : document.getElementById("password").value,
   "confirm_password" : document.getElementById("confirm_password").value
 });

 $.ajax({
   cache: false,
   type: 'POST',
   url: url,
   contentType: 'application/json',
   dataType: 'json',
   data: params,
   success: function(result) {
   },
   error: function(xhr, status, error) {
    }
     });
 });
 }
