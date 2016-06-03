#CSE-136-HW5#

## LOG IN !IMPORTANT##
To log into an account with prefilled data, use this account: 
Username: user1
Passsword: a


#Changes from HW4 to HW5
 * added service worker
 * stripped unused css (in production code)
 * added Google Analytics and Hotjar
 * specific http status codes returned for errors (400 for validation errors, 409 for duplicate database entry errors)
 * fixed and enhanced AJAX functions to be more dynamic/responsive
 * full pagination support
 * fixed error messages both with and without javascript
 * lots of refactoring
 * server-side validation for file upload
 * automatic login on successful signup

#Changes from HW3 to HW4
 * when no folders, show a placeholder
 * pagination
 * mentioned export/import issues was checked
 * reset password issue fixed


##Technologies implemented##
* This web application works fully with and without javascript! Just refresh page to show isomorphic abilities.
* Service worker
* Google Analytics and Hotjar
* loading bars to show progress in ajax requests. 
* pagination with javascript on and off
* used jquery in order to minimize code written, be more efficient with time, and so we can learn it as a team since we lacked experience in it. 
* error handling in ajax request to keep user informed of any issues.
* compression and caching static files
* logging 
 * errors
 * suspicious activity
 * database activity
* robot.txt file with traps built in to track users who are trying to access directories where they shouldn't be
 * If you hit the /delete route, we will track your ip in logging. 
* hiding technologies, such as: powered-by
* 404 redirects and error messages with logging
* front end and backend validation implemented for security
* sanitizing input frontend/backend to combat mysql injections
* sidebar can hide and show even when js is turned off, by clicking the bookmark header. When js is turned off, you can close it using the 'close' button on the bottom left of sidebar when compacted.
* hashing and salting passwords implemented with randomized salts for each user for maximum security
* top notch session management implemented to keep user session valids, destroy on logout, and refresh on page traversal 
* password reset implemented, including sending notifications emails to account owners (although it's not very useful in its current incomplete form)
* gulp for automated task management
 * minification of js, ejs, html, css, etc. implemented to decrease load time and requests
 * stripped unused css (in production code) to reduce file size
* production and development environment created and managed to decide when to use the production build(www) or development build
* Config file on github and that on server are different for security reasons.