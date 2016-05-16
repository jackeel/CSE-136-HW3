// TODO: ajax instead 
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

		if(!error) signupForm.submit();
    });
});