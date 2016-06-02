var version = 'v2'; 

this.addEventListener('install', function(event) {
  console.log('inside the install event listern install'); 
  event.waitUntil(
    caches.open(version).then(function(cache) {
      //should use regex 
      return cache.addAll([
        '/js/signup.js',
        '/js/jquery.min.js',
        '/js/login.js',
        '/js/signup.js',
        '/css/signup.css',
        '/css/style.css',
        '/font-awesome/css/font-awesome.min.css',
        '/html/offline.html',
        '/img/ajax-loader.gif',
      ]);
    })
  );
});

function loginOrSignUpRequest(eventURL, eventMethod)
{
  ///passwordReset
  if (eventURL.indexOf('login') > -1  || eventURL.indexOf('signup') > -1 
      || eventURL.indexOf('passwordReset') > -1 || eventURL === "http://localhost:3000/") {
    return true; 
  }
  else {
    return false; 
  }
}

self.addEventListener("fetch", function(event) {
  /* We should only cache GET requests, and deal with the rest of method in the
     client-side, by handling failed POST,PUT,PATCH,etc. requests.
  */

  var eventURL = event.request.url; 
  var eventMethod = event.request.method;

  if (eventMethod !== 'GET' && !loginOrSignUpRequest(eventURL,eventMethod)) {
    /* If we don't block the event as shown below, then the request will go to
       the network as usual.
    */
    console.log('WORKER: fetch event ignored.', event.request.method, event.request.url);
    return;
  }
  /* Similar to event.waitUntil in that it blocks the fetch event on a promise.
     Fulfillment result will be used as the response, and rejection will end in a
     HTTP response indicating failure.
  */
  event.respondWith(
    caches
      /* This method returns a promise that resolves to a cache entry matching
         the request. Once the promise is settled, we can then provide a response
         to the fetch request.
      */
      .match(event.request)
      .then(function(cached) {
        /* Even if the response is in our cache, we go to the network as well.
           This pattern is known for producing "eventually fresh" responses,
           where we return cached responses immediately, and meanwhile pull
           a network response and store that in the cache.
           Read more:
           https://ponyfoo.com/articles/progressive-networking-serviceworker
        */
        var networked = fetch(event.request)
          // We handle the network request with success and failure scenarios.
          .then(fetchedFromNetwork, unableToResolve)
          // We should catch errors on the fetchedFromNetwork handler as well.
          .catch(unableToResolve(event));

        /* We return the cached response immediately if there is one, and fall
           back to waiting on the network as usual.
        */
        console.log('WORKER: fetch event', cached ? '(cached)' : '(network)', event.request.url);
        return cached || networked;

        function fetchedFromNetwork(response) {
          /* We copy the response before replying to the network request.
             This is the response that will be stored on the ServiceWorker cache.
          */
          var cacheCopy = response.clone();

          console.log('WORKER: fetch response from network.', event.request.url);

          caches
            // We open a cache to store the response for this request.
            .open(version)
            .then(function add(cache) {
             
              //dont want to cache anything else beside bookmarks and folders. when logged in. 
              if(event.request.url.indexOf('list') > -1 || loginOrSignUpRequest(eventURL,eventMethod) && eventMethod === 'GET')
              { 
                cache.put(event.request, cacheCopy);
              }
            
            })
            .then(function() {
              console.log('WORKER: fetch response stored in cache.', event.request.url);
            });

          // Return the response so that the promise is settled in fulfillment.
          return response;
        }

        /* When this method is called, it means we were unable to produce a response
           from either the cache or the network. This is our opportunity to produce
           a meaningful response even when all else fails. It's the last chance, so
           you probably want to display a "Service Unavailable" view or a generic
           error response.
        */
        //TODO: check request here and use a rregex for appropiate responce. 
        //So decide whether we are rutrning a html page, or a json responce or the 
        //the cached version of a page. For example, if someone tries to deltete a folder or bookmark and the app is down, 
        //respond with a error status and json body similar to that which we used in the backend so that the error modal handles it. 
        //If they are trying to traverse a differnent page, such as a folder, list all, list all star, then give them the cache version and a error modal
        
        function unableToResolve () {

          //check this route first. /login POST.
          //if login, then take to offline version of page. 
          // /POST http://localhost:3000/login
          //WORKER: fetch event ignored. POST http://localhost:3000/login
          //console.log('WORKER: fetch event ignored.', event.request.method, event.request.url);

          //handles cases where user isn't logged in yet. 
          if(loginOrSignUpRequest(eventURL,eventMethod))
          {
            return caches.match('/html/offline.html');
          }
          else
          {
            //use for all other requests that use ajax...  send error message json. for error modal to get hit. in the spcified format being used
            //in order for it not to get stuck in laoding phase. 
            //say something line 'currnetly offline. loading old version of bookmarks. you cannot perform actions while offline'
            return new Response('<h1>Service Unavailable</h1>', {
              status: 503,
              statusText: 'Service Unavailable',
              headers: new Headers({
                'Content-Type': 'text/html'
              })
            });
          }
        }
      })
  );
});