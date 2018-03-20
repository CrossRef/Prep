self.importScripts('fuse.js');

let searchList = []

self.addEventListener('message', function(e) {
  if(e.data.searchList) {
    searchList = e.data.searchList
    console.log(searchList)
  }

  if(e.data.searchingFor) {
    console.log(searchList)

    const searchingFor = e.data.searchingFor

    const engine = new Fuse(searchList, {
      keys: ['name'],
      shouldSort: true,
      threshold: 0.4
    })

    const result = engine.search(searchingFor)

    self.postMessage(result)
  }

})