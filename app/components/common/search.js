import React from 'react'
import is from 'prop-types'
import Autocomplete from 'react-autocomplete'
import { List, CellMeasurer, CellMeasurerCache } from 'react-virtualized';

import deployConfig from '../../../deployConfig'




export default class Search extends React.Component {

  static propTypes = {
    searchData: is.array.isRequired,
    savedSearches: is.array,
    placeHolder: is.string.isRequired,
    onSelect: is.func.isRequired,
    listWidth: is.number,
    notFound: is.string
  }


  constructor (props) {
    super()

    this.cellHeightCache = new CellMeasurerCache({defaultHeight: 42, fixedWidth: true})

    this.state = {
      focused: false,
      searchingFor: '',
      data: Array.isArray(props.searchData) ? props.searchData : [],
      savedSearches: props.savedSearches
    }
  }


  componentWillReceiveProps (nextProps) {
    this.setState({data: nextProps.searchData})
  }


  renderInput = (props) => {
    return (
      <input
        {...props}
        className={`searchInput ${this.state.focused ? 'searchFocused' : ''}`}
        onFocus={()=>{
          props.onFocus()
          this.setState({focused: true})
        }}
        onBlur={()=>{
          props.onBlur()
          this.setState({focused: false})
        }}
        placeholder={`${this.state.focused ? '' : this.props.placeHolder}`}/>
    )
  }


  renderItem = (item) => {
    return <div className={`searchItem ${item.notFound ? 'unclickable' : ''}`}>{item.name}</div>
  }


  renderMenu = (items, searchingFor, autocompleteStyle) => {
    this.cellHeightCache.clearAll()

    const rowRenderer = ({key, index, parent, isScrolling, isVisible, style}) => {
      const Item = items[index]
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
          {React.cloneElement(Item, {style: style, key: key, onMouseEnter: null, onMouseDown: onMouseDown})}
        </CellMeasurer>
      )
    }

    return (
      <List
        rowHeight={this.cellHeightCache.rowHeight}
        height={207}
        rowCount={items.length}
        rowRenderer={rowRenderer}
        width={this.props.listWidth || Math.ceil(autocompleteStyle.minWidth) + 2 || 0}
        scrollToIndex={0}
        style={{
          position: 'absolute',
          height: 'auto',
          display: (this.state.searchingFor && items.length) || (!this.state.searchingFor && this.state.savedSearches) ? 'initial' : 'none',
        }}
      />
    )
  }


  render () {
    let data
    if(!this.state.searchingFor && this.state.savedSearches) {
      data = this.state.savedSearches
    } else {
      if(!this.state.searchingFor) {
        data = []
      } else {
        data = this.state.data.filter( item => item.name && item.name.toLowerCase().includes(this.state.searchingFor.toLowerCase()))
        if(!data.length) {
          data = this.props.notFound ? [{name: this.props.notFound, notFound: true}] : []
        }
      }
    }


    return (
      <Autocomplete
        renderInput={this.renderInput}
        renderItem={this.renderItem}
        items={data}
        getItemValue={ item => item.name }

        value={this.state.searchingFor}
        onChange={(e, value)=> this.setState({searchingFor: value})}
        onSelect={this.props.onSelect}

        renderMenu={this.renderMenu}

        wrapperProps={{
          className: 'searchInputHolder',
          style:{}
        }}
      />
    )
  }

}