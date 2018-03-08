import React from 'react'
import is from 'prop-types'
import Autocomplete from 'react-autocomplete'
import { List, CellMeasurer, CellMeasurerCache } from 'react-virtualized';
const Fuse = require('fuse.js')

import deployConfig from '../../../../deployConfig'




export default class Search extends React.Component {

  static propTypes = {
    history: is.shape({
      push: is.func.isRequired
    }).isRequired
  }


  constructor () {
    super()

    this.cellHeightCache = new CellMeasurerCache({defaultHeight: 42, fixedWidth: true})



    this.state = {
      focused: false,
      searchingFor: '',
      data: [],
      savedSearches: undefined
    }
  }


  componentDidMount () {
    const savedSearches = localStorage.getItem('savedSearches')
    if(savedSearches) {
      this.setState({savedSearches: JSON.parse(savedSearches)})
    }
    fetch('https://apps.crossref.org/prep-staging/data?op=members')
      .then( r => r.json())
      .then( r => {
        this.fuseSearchEngine = new Fuse(r.message, {
          keys: ['name'],
          shouldSort: false,
          threshold: 0.6
        })
        this.setState({data: r.message})
      })
      .catch(e=>{
        console.error(e)
      })
  }


  onSelect = (value, selection) => {
    let savedSearches = JSON.parse(localStorage.getItem('savedSearches'))

    if(!savedSearches) {
      savedSearches = [selection]

    } else {
      let savedIndex
      const alreadySaved = savedSearches.some( (savedItem, i) => {
        if(savedItem.id === selection.id && savedItem.name === selection.name) {
          savedIndex = i
          return true
        }
      })

      if(alreadySaved) {
        savedSearches.splice(savedIndex, 1)
        savedSearches.unshift(selection)

      } else {
        if(savedSearches.length === 6) {
          savedSearches.pop()
        }
        savedSearches.unshift(selection)
      }
    }

    localStorage.setItem('savedSearches', JSON.stringify(savedSearches))
    this.props.history.push(`${deployConfig.baseUrl}${encodeURIComponent(selection.name)}/${selection.id}`)
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
        placeholder={`${this.state.focused ? '' : 'Search by member'}`}/>
    )
  }


  renderItem = (item) => {
    return <div className='searchItem'>{item.name}</div>
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
        width={Math.ceil(autocompleteStyle.minWidth) + 2 || 0}
        scrollToIndex={0}
        style={{
          position: 'absolute',
          top: '48px',
          right: '-1px',
          backgroundColor: 'white',
          border: "1px solid black",
          paddingTop: '10px',
          height: 'auto',
          maxHeight: '207px',
          outline: 'none',
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
        data = this.fuseSearchEngine.search(this.state.searchingFor)
        if(!data.length) {
          data = []
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
        onSelect={this.onSelect}

        renderMenu={this.renderMenu}

        wrapperProps={{
          className: 'searchInputHolder',
          style:{}
        }}
      />
    )
  }

}