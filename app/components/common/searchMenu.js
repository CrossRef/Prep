import React from 'react'
import is from 'prop-types'
import Autocomplete from 'react-autocomplete'
import { List, CellMeasurer, CellMeasurerCache } from 'react-virtualized';
const Fuse = require('fuse.js')



export default class extends React.Component {

  static propTypes = {
    data: is.array.isRequired,
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
    }

    this.ww1 = new Worker('wwArray/ww1.js')
    this.ww1.postMessage({searchList: this.state.data})
  }


  componentWillReceiveProps (nextProps) {

    if(nextProps.searchingFor && nextProps.searchingFor !== this.props.searchingFor) {


      this.state.waitingFor = nextProps.searchingFor

      this.ww1.postMessage({searchingFor: nextProps.searchingFor})

      this.ww1.onmessage = event => {
        console.log(event.data)
      }



      // fetch(`testSearch`, {
      //   method: 'POST',
      //   body: JSON.stringify({data: nextProps.data, searchingFor: nextProps.searchingFor}),
      //   headers: {
      //     'content-type': 'application/json'
      //   }
      // }).then(r => {
      //   return r.json()
      // })
      //   .then( r => {
      //     if(this.state.waitingFor !== r.searchingFor) return
      //
      //     this.setState({
      //       data: r.data,
      //       waiting: false
      //     })
      //   })



      // fetch(`sw?searchingFor=${nextProps.searchingFor}`).then(r=>r.json()).then(r => {
      //   if(this.state.waitingFor !== r.searchingFor) return
      //
      //   this.setState({data: r.data, waiting: false})
      // })



      // new Promise(function(resolve, reject){
      //   // Create a Message Channel
      //   const msg_chan = new MessageChannel();
      //
      //   // Handler for recieving message reply from service worker
      //   msg_chan.port1.onmessage = function(event){
      //     if(event.data.error){
      //       reject(event.data.error);
      //     }else{
      //       resolve(event.data);
      //     }
      //   };
      //
      //   // Send message to service worker along with port for reply
      //
      //   performance.mark('start')
      //   navigator.serviceWorker.controller.postMessage(nextProps.searchingFor, [msg_chan.port2]);
      // })
      //   .then( r => {
      //     performance.mark('end')
      //     performance.measure('postMessage time', 'start', 'end')
      //     if(this.state.waitingFor !== r.searchingFor) return
      //
      //     this.setState({data: r.data, waiting: false})
      //   })


    } else {

      this.ww1.postMessage({searchList: nextProps.data})
      this.setState({data: nextProps.data})
    }
  }


  shouldComponentUpdate (nextProps, nextState) {
    if(!nextProps.searchingFor) return true
    return nextProps.searchingFor === this.props.searchingFor
  }


  rowRenderer = ({key, index, parent, isScrolling, isVisible, style}) => {
    const Item = this.state.data[index]
    const onMouseDown = (e) => {
      if(e.button === 0) {
        Item.props.onClick(e)
      }
    }

    return (

      <CellMeasurer
        cache={this.cellHeightCache}
        columnIndex={0}
        key={key}
        parent={parent}
        rowIndex={index}
      >
        {/*{React.cloneElement(Item, {style: style, key: key, onMouseEnter: null, onMouseDown: onMouseDown})}*/}

        <div
          className={`searchItem ${Item.notFound ? 'unclickable' : ''}`}
          onClick={()=>this.props.onSelect(Item.name, Item)}
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