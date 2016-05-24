// TODO: ajax instead
window.onload = function() {
  /*************************** AJAX **********************************/
  //signup new user
  //$("#signup_form").on("submit", function (event) {
//     console.log("inside the ajax part of signup");
//     event.preventDefault();
//     window.location.hash = "";
//     var url = '/signup';
//     var params = JSON.stringify({
//       "email" : document.getElementById("email").value,
//       "username" : document.getElementById("username").value,
//       "password" : document.getElementById("password").value,
//       "confirm_password" : document.getElementById("confirm_password").value
//     });
// console.log('ajax call');
//     $.ajax({
//       cache: false,
//       type: 'POST',
//       url: url,
//       contentType: 'application/json',
//       dataType: 'json',
//       data: params,
//       success: function(result) {
//       },
//       error: function(xhr, status, error) {
//        }
//         });
//     });
//}
window.addEventListener('load', function() {
    var signupForm = document.getElementById("signup_form");
    signupForm.addEventListener("submit", function (event) {
        event.preventDefault();

        var error = false;
		var user = document.getElementById("username");
		if(user.value.length > 25) {
        	user.style.border = "1px solid red";
        	user.style.borderRadius = "4px";
        	error = true;
        } else {
        	user.style.border = "none";
        }

        var pass = document.getElementById("password");
	    if(pass.value.length > 64) {
        	pass.style.border = "1px solid red";
        	pass.style.borderRadius = "4px";
        	error = true;
        } else {
        	pass.style.border = "none";
        }

        var confirm_pass = document.getElementById("confirm_password");
        if(confirm_pass.value !== pass.value ) {
        	confirm_pass.style.border = "1px solid red";
        	confirm_pass.style.borderRadius = "4px";
        	error = true;
        } else {
        	confirm_pass.style.border = "none";
        }

		if(!error)
    {
      console.log("inside the ajax part of signup");
      event.preventDefault();
      window.location.hash = "";
      var url = '/signup';
      var params = JSON.stringify({
        "email" : document.getElementById("email").value,
        "username" : document.getElementById("username").value,
        "password" : document.getElementById("password").value,
        "confirm_password" : document.getElementById("confirm_password").value
      });
  console.log('ajax call');
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
    //signupForm.submit();
    });
});
