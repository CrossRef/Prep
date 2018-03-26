self.importScripts('fuse.js');

let searchList = []

let cache = {}

self.addEventListener('message', function(e) {
  if(e.data.searchList) {
    searchList = e.data.searchList
    cache = {}
  }

  if(e.data.searchingFor) {

    const searchingFor = e.data.searchingFor

    const cachedResult = cache[searchingFor]

    if(cachedResult) {
      self.postMessage(cachedResult)
      return
    }

    const engine = new Fuse(searchList, {
      keys: ['name'],
      shouldSort: true,
      threshold: 0.2
    })

    const result = engine.search(searchingFor)

    const message = {searchResult: result, searchingFor: searchingFor}

    cache[searchingFor] = message

    self.postMessage(message)
  }

})