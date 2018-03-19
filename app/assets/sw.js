self.importScripts('fuse.js');


let engine = new Fuse([], {
  keys: ['name'],
  shouldSort: true,
  threshold: 0.4
})


let cache = {}


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
    fetch('https://apps.crossref.org/prep-staging/data?op=members')
      .then( r => r.json())
      .then( r => {
        console.log(r.message.length)

        engine = new Fuse(r.message, {
          keys: ['name'],
          shouldSort: true,
          threshold: 0.4
        })
      })
  );
});


self.addEventListener('fetch', function(event) {
  if(event.request.url.includes('http://localhost:3333/participationreports/sw')) {
    const searchingFor = getSearchQuery(event.request.url)

    const cacheResult = cache[searchingFor]

    if(searchingFor.length === 1) {
      cache = {}
      cache[searchingFor] = cacheResult
    }

    const init = {
      status: 200,
      statusText: "OK",
      headers: {'Content-Type': 'application/json'}
    };

    if(cacheResult) {
      const response = new Response(JSON.stringify({data: cacheResult, searchingFor: searchingFor}), init);

      event.respondWith(response)
      return
    }

    cache[searchingFor] = engine.search(searchingFor)

    const response = new Response(JSON.stringify({data: cache[searchingFor], searchingFor: searchingFor}), init);

    event.respondWith(
      response
    )
  }
});