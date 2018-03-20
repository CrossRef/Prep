self.importScripts('fuse.js');

let searchData = []

let cache = {}

self.addEventListener('message', function(e) {
  if(e.data.searchData) {
    searchData = e.data.searchData
    cache = {}
  }

  if(e.data.searchingFor) {

    const searchingFor = e.data.searchingFor

    const cachedResult = cache[searchingFor]

    if(cachedResult) {
      self.postMessage(cachedResult)
      return
    }

    const engine = new Fuse(searchData, {
      keys: ['name'],
      shouldSort: true,
      threshold: 0.4
    })

    const result = engine.search(searchingFor)

    const message = {searchResult: result, searchingFor: searchingFor}

    cache[searchingFor] = message

    self.postMessage(message)
  }

})