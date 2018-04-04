import React from 'react'
import is from 'prop-types'
import { List, CellMeasurer, CellMeasurerCache } from 'react-virtualized';

import searchWorker from '../../utilities/searchWorker'



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

    this.searchWorker = new searchWorker({
      resultsHandler: this.handleSearchResults,
      searchList: props.searchList,
      arraySize: 4,
      workerLocation: 'assets/webWorkers/'
    })
  }


  componentWillReceiveProps (nextProps) {

    if(nextProps.searchList.length > this.props.searchList.length) {
      this.searchWorker.assignSearchList(nextProps.searchList)
    }


    if(nextProps.searchingFor && nextProps.searchingFor !== this.props.searchingFor) {

      const searchingForTrim = nextProps.searchingFor.trim()

      this.setState({waitingFor: searchingForTrim})

      this.searchWorker.search(searchingForTrim)

    } else {
      this.setState({data: !nextProps.searchingFor ? nextProps.initialData : this.state.data, waitingFor: false})
    }
  }


  handleSearchResults = event => {
    const {searchResult, searchingFor} = event.data

    this.setState( prevState => {
      if(!prevState.waitingFor) return null

      return {
        data: !searchResult.length && this.props.notFound ? [{name: this.props.notFound, notFound: true}] : searchResult,
        waitingFor: searchingFor === prevState.waitingFor ? false : prevState.waitingFor
      }
    })
  }


  componentWillUnmount() {
    this.searchWorker.terminate()
  }


  shouldComponentUpdate (nextProps, nextState) {
    /*Since getting an updated search query dispatches an asynchronous call to the webWorker to do the search, there
    is no need to update the results menu on that initial change to the search query. It should instead wait for the
    webworker to finish before updating. This code declines updates while waiting for the result to come back. */

    return nextState.waitingFor === false || nextState.data.length !== this.state.data
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