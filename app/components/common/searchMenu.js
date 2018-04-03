import React from 'react'
import is from 'prop-types'
import { List, CellMeasurer, CellMeasurerCache } from 'react-virtualized';



export default class SearchMenu extends React.Component {

  static propTypes = {
    initialData: is.array.isRequired,
    searchList: is.array.isRequired,
    searchingFor: is.string,
    listWidth: is.number,
    onSelect: is.func.isRequired,
    focused: is.bool.isRequired,
    notFound: is.string
  }


  constructor (props) {
    super()

    this.cellHeightCache = new CellMeasurerCache({defaultHeight: 42, fixedWidth: true})

    this.state = {
      data: props.initialData || [],
      waitingFor: false
    }

    this.workerArray = new Worker('assets/webWorkers/workerArray.js')
    this.ww1 = new Worker('assets/webWorkers/ww1.js')
    this.ww2 = new Worker('assets/webWorkers/ww2.js')
    this.ww3 = new Worker('assets/webWorkers/ww3.js')
    this.ww4 = new Worker('assets/webWorkers/ww4.js')

    const channel1 = new MessageChannel()
    this.workerArray.postMessage({port: "ww1"}, [channel1.port1])
    this.ww1.postMessage({port: "ww1"}, [channel1.port2])

    const channel2 = new MessageChannel()
    this.workerArray.postMessage({port: "ww2"}, [channel2.port1])
    this.ww2.postMessage({port: "ww2"}, [channel2.port2])

    const channel3 = new MessageChannel()
    this.workerArray.postMessage({port: "ww3"}, [channel3.port1])
    this.ww3.postMessage({port: "ww3"}, [channel3.port2])

    const channel4 = new MessageChannel()
    this.workerArray.postMessage({port: "ww4"}, [channel4.port1])
    this.ww4.postMessage({port: "ww4"}, [channel4.port2])


    this.workerArray.postMessage({searchList: props.searchList})
  }


  componentWillReceiveProps (nextProps) {

    if(nextProps.searchList.length > this.props.searchList.length) {
      this.workerArray.postMessage({searchList: nextProps.searchList})
    }


    if(nextProps.searchingFor && nextProps.searchingFor !== this.props.searchingFor) {

      this.setState({waitingFor: nextProps.searchingFor})

      this.workerArray.postMessage({searchingFor: nextProps.searchingFor})

      this.workerArray.onmessage = event => {

        const {searchResult, searchingFor} = event.data

        if(this.state.waitingFor === searchingFor) {
          this.setState({
            data: !searchResult.length && this.props.notFound ? [{name: this.props.notFound, notFound: true}] : searchResult,
            waitingFor: false
          })
        }
      }

    } else {
      this.setState({data: !nextProps.searchingFor ? nextProps.initialData : this.state.data, waitingFor: false})
    }
  }


  componentWillUnmount() {
    this.workerArray.terminate()
    this.ww1.terminate()
    this.ww2.terminate()
    this.ww3.terminate()
    this.ww4.terminate()
  }


  shouldComponentUpdate (nextProps, nextState) {
    /*Since getting an updated search query dispatches an asynchronous call to the webWorker to do the search, there
    is no need to update the results menu on that initial change to the search query. It should instead wait for the
    webworker to finish before updating. This code declines updates while waiting for the result to come back. */

    return nextState.waitingFor === false
  }


  rowRenderer = ({key, index, parent, isScrolling, isVisible, style}) => {
    const Item = this.state.data[index]

    return (

      <CellMeasurer
        cache={this.cellHeightCache}
        columnIndex={0}
        key={key}
        parent={parent}
        rowIndex={index}
      >

        <div
          className={`searchItem ${Item.notFound ? 'unclickable' : ''}`}
          onMouseDown={()=>{
            this.props.onSelect(Item.name, Item)
          }}
          style={style}
        >
          {Item.name}
        </div>

      </CellMeasurer>
    )
  }


  render() {
    this.cellHeightCache.clearAll()

    return this.state.data.length && this.props.focused ?
      <List
        rowHeight={this.cellHeightCache.rowHeight}
        height={207}
        rowCount={this.state.data.length}
        rowRenderer={this.rowRenderer}
        width={this.props.listWidth || 0}
        scrollToIndex={0}
        style={{
          position: 'absolute',
          height: 'auto'
        }}
      />
    :
      null

  }
}