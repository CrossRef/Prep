import React from 'react'
import is from 'prop-types'
import { List, CellMeasurer, CellMeasurerCache } from 'react-virtualized';



export default class SearchMenu extends React.Component {

  static propTypes = {
    data: is.array.isRequired,
    searchList: is.array.isRequired,
    searchingFor: is.string,
    listWidth: is.number,
    onSelect: is.func.isRequired,
    notFound: is.string
  }


  constructor (props) {
    super()

    this.cellHeightCache = new CellMeasurerCache({defaultHeight: 42, fixedWidth: true})

    this.state = {
      data: props.data || [],
      waitingFor: false
    }

    this.webWorker = new Worker('assets/webWorkers/ww1.js')
    this.webWorker.postMessage({searchList: props.searchList})
  }


  componentWillReceiveProps (nextProps) {

    if(nextProps.searchList.length > this.props.searchList.length) {
      this.webWorker.postMessage({searchList: nextProps.searchList})
    }


    if(nextProps.searchingFor && nextProps.searchingFor !== this.props.searchingFor) {

      this.setState({waitingFor: nextProps.searchingFor})

      this.webWorker.postMessage({searchingFor: nextProps.searchingFor})

      this.webWorker.onmessage = event => {

        const {searchResult, searchingFor} = event.data

        if(this.state.waitingFor === searchingFor) {
          this.setState({
            data: !searchResult.length && this.props.notFound ? [{name: this.props.notFound, notFound: true}] : searchResult,
            waitingFor: false
          })
        }
      }


    } else {
      this.setState({data: nextProps.data, waitingFor: false})
    }
  }


  componentWillUnmount() {
    this.webWorker.terminate()
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

    return (
      <List
        rowHeight={this.cellHeightCache.rowHeight}
        height={207}
        rowCount={this.state.data.length}
        rowRenderer={this.rowRenderer}
        width={this.props.listWidth || 0}
        scrollToIndex={0}
        style={{
          position: 'absolute',
          height: 'auto',
          display: this.state.data.length ? 'initial' : 'none',
        }}
      />
    )
  }
}