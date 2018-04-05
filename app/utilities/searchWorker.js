



export default class searchWorker {

  constructor ({resultsHandler, searchList, arraySize, workerLocation}) {

    this.workerArray = new Worker(`${workerLocation}/workerArray.js`)

    let i = 1
    this.webWorkers = {}

    while (i <= arraySize) {
      const webWorkerName = `ww${i}`

      this.webWorkers[webWorkerName] = new Worker(`${workerLocation}/${webWorkerName}.js`)

      const webWorker = this.webWorkers[webWorkerName]

      const channel = new MessageChannel()
      this.workerArray.postMessage({port: webWorkerName}, [channel.port1])
      webWorker.postMessage({port: webWorkerName}, [channel.port2])

      webWorker.onerror = e => {
        console.error(`Error initiating webWorker ${webWorkerName}, please check your webWorker folder.`)
        delete this.webWorkers[webWorkerName]
        this.workerArray.postMessage({delete: webWorkerName})
      }

      i++
    }

    this.workerArray.postMessage({searchList: searchList})

    this.workerArray.onmessage = resultsHandler
  }


  assignSearchList = (searchList) => {
    this.workerArray.postMessage({searchList: searchList})
  }


  assignResultHandler = (handler) => {
    this.workerArray.onmessage = handler
  }


  search = (string) => {
    this.workerArray.postMessage({searchingFor: string})
  }


  terminate() {
    console.log(this)
    this.workerArray.terminate()

    for (const webWorkerName in this.webWorkers) {
      this.webWorkers[webWorkerName].terminate()
    }
  }
}