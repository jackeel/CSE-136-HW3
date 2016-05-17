#CSE-136-HW3#

##Testing##
Dummy data was preset in the database for testing.
Please note that the data is reset every time the application is reset (dropped if exist in schemas).

##Technologies implemented##

* compression and caching static files
* logging 
 * errors
 * suspicious activity
 * database activity
* robot.txt file with traps built in to track users who are trying to access directories where they shouldn't be
* hiding technologies, such as: powered-by
* 404 redirects and error messages with logging
* front end and backend validation implemented for security
* sanitizing input backend to combat mysql injections
* hashing and salting passwords implemented with randomized salts for each user for maximum security
* top notch session management implemented to keep user session valids, destroy on logout, and refresh on page traversal 
* password reset implemented, including sending notifications emails to account owners (although it's not very useful in its current incomplete form)
* gulp for automated task management
 * minification of js, ejs, html, css, etc. implemented to decrease load time and requests
* production and development environment created and managed
* Config file on github and that on server are different for security reasons.
