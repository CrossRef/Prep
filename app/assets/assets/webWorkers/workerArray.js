const ports = {}

let cache = {}

const fuzzySearchOptions = {
  keys: ['name'],
  shouldSort: true,
  threshold: 0.2,
  distance: 500
}


self.addEventListener('message', function(e) {

  if(e.data.port) {
    ports[e.data.port] = e.ports[0]

    const webWorker = ports[e.data.port]
    webWorker.inUse = false
    webWorker.lastSearch = undefined

    webWorker.onmessage = function (e) {

      const searchingFor = e.data.searchingFor
      const searchResult = e.data.searchResult

      if(webWorker.lastSearch === searchingFor) {
        webWorker.inUse = false
      }

      const message = {searchResult, searchingFor}

      cache[searchingFor] = message

      self.postMessage(message)
    }
  }


  if(e.data.searchList) {

    searchList = e.data.searchList
    cache = {}

    for (const port in ports) {
      ports[port].postMessage({searchList: searchList, fuzzySearchOptions: fuzzySearchOptions})
    }
  }


  if(e.data.searchingFor) {

    const searchingFor = e.data.searchingFor

    const cachedResult = cache[searchingFor]

    if(cachedResult) {
      self.postMessage(cachedResult)
      return
    }

    const searchOptions = {
      keys: ['name'],
      shouldSort: true,
      threshold: 0.2,
      distance: 500
    }

    if(searchingFor.length > 32) {
      searchOptions.tokenize = true
      searchOptions.matchAllTokens = true
    }

    const message = {searchingFor: searchingFor, searchOptions: searchOptions}

    let firstInUse

    for (const port in ports) {
      const webWorker = ports[port]

      if(!webWorker.inUse) {
        webWorker.postMessage(message)
        webWorker.inUse = Date.now()
        break

      } else {
        if(!firstInUse) {
          firstInUse = webWorker
        } else {
          if(firstInUse.inUse > webWorker.inUse) {
            firstInUse = webWorker
          }
        }
      }
    }

    if(firstInUse) {
      firstInUse.postMessage(message)
      firstInUse.inUse = Date.now()
      firstInUse.lastSearch = searchingFor
    }
  }
})