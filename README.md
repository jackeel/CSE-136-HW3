#CSE-136-HW4#

## LOG IN !IMPORTANT##
to log into a account with prefilled data, use this accound: 
Username: user1
Passsword: a

##Testing##
Dummy data was preset in the database for testing.
Please note that the data is reset every time the application is reset (dropped if exist in schemas).

##Technologies implemented##
* This web application works fully with and without javasccript! Just refresh page to show isomorphic abilities. 
* loading bars to show progress in ajax requests. 
* paginiation with javascript on and off
* used jquery in order to minimize code written, be more efficient with time, and so we can learn it as a team since we lacked experience in it. 
* error handling in ajax request to keep user informed of any issues.
* handled corner cases suggested by the ta to implement in HW3: 
 * when no folders, show a placeholder
 * pagination
 * export/import issues was checked.
 * reset password issue fixed
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
* production and development environment created and managed to decide when to use the production build(www) or development build
* Config file on github and that on server are different for security reasons.
