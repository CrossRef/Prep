import React from 'react'
import is from 'prop-types'

import deployConfig from '../../../deployConfig'
import SearchMenu from './searchMenu'




export default class Search extends React.Component {

  static propTypes = {
    searchList: is.array.isRequired,
    savedSearches: is.array,
    placeHolder: is.string.isRequired,
    onSelect: is.func.isRequired,
    listWidth: is.number,
    notFound: is.string,
    addWidth: is.number
  }


  static defaultProps = {
    addWidth: 0
  }


  constructor (props) {
    super()

    this.state = {
      focused: false,
      searchingFor: '',
      listWidth: props.listWidth
    }

    this.exposedRefs = {
      listRefs: {},
      input: null
    }
  }


  componentDidMount () {
    this.setState({listWidth: parseFloat(window.getComputedStyle(this.exposedRefs.input).width) + 2})
  }


  searchFocus = () => {
    this.setState({
      focused: true,
      listWidth: parseFloat(window.getComputedStyle(this.exposedRefs.input).width) + 2
    })
  }


  searchBlur = e => {
    if( !e.relatedTarget || (
        !e.relatedTarget.classList.contains('ReactVirtualized__List') &&
        !e.relatedTarget.classList.contains('searchItem')
      )) {
      this.setState({focused: false})
    }
  }


  keyDownHandler = e => {
    const arrowDown = e.keyCode === 40
    if (arrowDown) {
      e.preventDefault()
      this.exposedRefs.listRefs[0].focus()
    }
  }


  render () {
    let initialData = []
    if(this.state.focused && !this.state.searchingFor && this.props.savedSearches) {
      initialData = this.props.savedSearches
    }

    return (
      <div className='searchInputHolder'
        onBlur={this.searchBlur}
      >

        <input
          className={`searchInput ${this.state.focused ? 'searchFocused' : ''}`}
          ref={ node => this.exposedRefs.input = node}
          onFocus={this.searchFocus}
          placeholder={`${this.state.focused ? '' : this.props.placeHolder}`}
          onChange={(e)=> {
            this.setState({searchingFor: e.target.value})
          }}
          value={this.state.searchingFor}
          onKeyDown={this.keyDownHandler}
        />


        <SearchMenu
          initialData={initialData}
          searchList={this.props.searchList}
          onSelect={this.props.onSelect}
          listWidth={(this.props.listWidth || this.state.listWidth || 0) + this.props.addWidth}
          searchingFor={this.state.searchingFor}
          notFound={this.props.notFound}
          focused={this.state.focused}
          exposedRefs={this.exposedRefs}
        />
      </div>
    )
  }
}