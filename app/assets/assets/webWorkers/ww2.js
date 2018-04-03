self.importScripts('fuse.js');

let searchList = []

let port

self.addEventListener('message', function(e) {

  if(e.data.port) {
    port = e.ports[0]

    port.onmessage = function (e) {

      if(e.data.searchList) {
        searchList = e.data.searchList
      }

      if(e.data.searchingFor) {

        const searchingFor = e.data.searchingFor

        const engine = new Fuse(searchList, e.data.searchOptions)

        const result = engine.search(searchingFor)

        const message = {searchResult: result, searchingFor: searchingFor, wwId: 'ww2'}

        port.postMessage(message)
      }
    }
  }


})