self.importScripts('fuse.js');


function getSearchQuery (url) {
  var name = 'searchingFor'
  var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
    results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, " "));
}


self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open('memberData').then(function(cache) {
      return cache.add('https://apps.crossref.org/prep-staging/data?op=members')
    })
  );
});


self.addEventListener('fetch', function(event) {
  if(event.request.url.includes('http://localhost:3333/participationreports/sw')) {

    const searchingFor = getSearchQuery(event.request.url)

    event.respondWith(
      caches.match(event.request).then(function(cachedResponse){
        if (cachedResponse) {
          return cachedResponse

        } else {
          return caches.match('https://apps.crossref.org/prep-staging/data?op=members').then(function(cachedMembers) {

            return cachedMembers.json().then( members => {

              const engine = new Fuse(members.message, {
                keys: ['name'],
                shouldSort: true,
                threshold: 0.4
              })

              const searchResult = engine.search(searchingFor)

              const init = {
                status: 200,
                statusText: "OK",
                headers: {'Content-Type': 'application/json'}
              };

              const stringifiedBody = JSON.stringify({data: searchResult, searchingFor: searchingFor})

              const newResponse = new Response(stringifiedBody, init);
              const responseClone = newResponse.clone()

              caches.open('searchResults').then(function(cache){
                cache.put(event.request, responseClone)
              })

              return newResponse
            })
          })
        }
      })
    )
  }

  if(event.request.url.includes('https://apps.crossref.org/prep-staging/data?op=participation')) {
    caches.delete('searchResults')
  }

  if(event.request.url.includes('https://apps.crossref.org/prep-staging/data?op=members')) {
    event.respondWith(
      caches.match('https://apps.crossref.org/prep-staging/data?op=members').then(function(cachedMembers) {
        return cachedMembers || fetch(event.request).then(function(membersResponse) {
          return caches.open('memberData').then(function(cache){
            cache.put(event.request, membersResponse.clone())
            return membersResponse
          })
        })
      })
    )
  }
});


self.addEventListener('message', function(event){

  const searchingFor = event.data


  caches.match(searchingFor).then(function(cachedResponse){
    if (cachedResponse) {
      cachedResponse.json().then( r => event.ports[0].postMessage(r) )


    } else {
      caches.match('https://apps.crossref.org/prep-staging/data?op=members').then(function(cachedMembers) {

        cachedMembers.json().then( members => {

          const engine = new Fuse(members.message, {
            keys: ['name'],
            shouldSort: true,
            threshold: 0.4
          })

          const searchResult = engine.search(searchingFor)

          const init = {
            status: 200,
            statusText: "OK",
            headers: {'Content-Type': 'application/json'}
          };

          const stringifiedBody = JSON.stringify({data: searchResult, searchingFor: searchingFor})

          const newResponse = new Response(stringifiedBody, init);
          const responseClone = newResponse.clone()

          caches.open('searchResults').then(function(cache){
            cache.put(searchingFor, responseClone)
          })

          newResponse.json().then( r => event.ports[0].postMessage(r))
        })
      })
    }
  })

});


// self.addEventListener('activate', function(event) {
//   event.waitUntil(
//     caches.keys().then(function(cacheNames) {
//       return Promise.all(
//         cacheNames.filter(function(cacheName) {
//           // Return true if you want to remove this cache,
//           // but remember that caches are shared across
//           // the whole origin
//         }).map(function(cacheName) {
//           return caches.delete(cacheName);
//         })
//       );
//     })
//   );
// });