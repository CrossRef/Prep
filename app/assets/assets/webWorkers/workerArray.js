const ports = {}

let cache = {}

let que

let logging = false



self.addEventListener('message', function(e) {

  if(e.data.port) {
    ports[e.data.port] = e.ports[0]

    const webWorker = ports[e.data.port]
    webWorker.inUse = false
    webWorker.lastSearch = undefined

    webWorker.onmessage = function (e) {

      const searchingFor = e.data.searchingFor
      const searchResult = e.data.searchResult

      const message = {searchResult, searchingFor}

      if(que) {
        webWorker.postMessage(que.message)
        const now = Date.now()
        if(logging) console.log(e.data.wwId, 'FINISHED', now - webWorker.inUse, 'TAKING QUE', now - que.time, que.message.searchingFor.length)
        webWorker.inUse = now
        que = null
      } else {
        if(logging) console.log(e.data.wwId, 'FINISHED', Date.now() - webWorker.inUse, searchingFor.length)
        webWorker.inUse = false
      }

      cache[searchingFor] = message

      self.postMessage(message)
    }
  }


  if(e.data.searchList) {

    searchList = e.data.searchList
    cache = {}

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

    for (const port in ports) {
      const webWorker = ports[port]

      if(!webWorker.inUse) {
        webWorker.postMessage(message)
        webWorker.inUse = Date.now()
        if(logging) console.log(port, 'CLOSED', searchingFor.length)
        return
      }
    }

    que = {message, time: Date.now()}
  }
})