// TODO: ajax instead 
window.addEventListener('load', function() {
    var loginForm = document.getElementById("login_form");
    loginForm.addEventListener("submit", function (event) {
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

        if(!error) loginForm.submit();
    });
});

if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/js/service-worker.js', {
        scope: '/js/'
    }).then(function(reg) {
        console.log('Yey!', reg);
    }).catch(function(err) {
        console.log('Boo!', err);
    });
}