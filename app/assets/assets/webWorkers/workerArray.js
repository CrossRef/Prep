const ports = {}

const cache = {}


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

    for (const port in ports) {
      ports[port].postMessage({searchList: searchList})
    }
  }


  if(e.data.searchingFor) {

    const searchingFor = e.data.searchingFor

    const cachedResult = cache[searchingFor]

    if(cachedResult) {
      self.postMessage(cachedResult)
      return
    }

    let firstInUse

    for (const port in ports) {
      const webWorker = ports[port]

      if(!webWorker.inUse) {
        webWorker.postMessage({searchingFor: searchingFor})
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
      firstInUse.postMessage({searchingFor: searchingFor})
      firstInUse.inUse = Date.now()
      firstInUse.lastSearch = searchingFor
    }




    // const searchingFor = e.data.searchingFor
    //
    // const cachedResult = cache[searchingFor]
    //
    // if(cachedResult) {
    //   self.postMessage(cachedResult)
    //   return
    // }
    //
    // const engine = new Fuse(searchList, {
    //   keys: ['name'],
    //   shouldSort: true,
    //   threshold: 0.2,
    //   distance: 500
    // })
    //
    // const result = engine.search(searchingFor)
    //
    // const message = {searchResult: result, searchingFor: searchingFor, wwIndex: 1}
    //
    // cache[searchingFor] = message
    //
    // self.postMessage(message)
  }

})