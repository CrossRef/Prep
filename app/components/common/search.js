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
    notFound: is.string
  }


  constructor (props) {
    super()

    this.state = {
      focused: false,
      searchingFor: '',
      listWidth: props.listWidth
    }
  }


  componentDidMount () {
    this.setState({listWidth: parseFloat(window.getComputedStyle(this.input).width) + 2})
  }


  render () {
    let data = []

    if(this.state.focused) {

      if(!this.state.searchingFor && this.props.savedSearches) {
        data = this.props.savedSearches

      } else {
        if(!this.state.searchingFor) {
          data = []

        } else {
          data = this.props.searchList
        }
      }
    }


    return (
      <div className='searchInputHolder'>

        <input
          className={`searchInput ${this.state.focused ? 'searchFocused' : ''}`}
          ref={ node => this.input = node}
          onFocus={()=>{
            this.setState({
              focused: true,
              listWidth: parseFloat(window.getComputedStyle(this.input).width) + 2
            })
          }}
          onBlur={()=>this.setState({focused: false})}
          placeholder={`${this.state.focused ? '' : this.props.placeHolder}`}
          onChange={(e)=> {
            this.setState({searchingFor: e.target.value})
          }}
          value={this.state.searchingFor}
        />


        <SearchMenu
          data={data}
          searchList={this.props.searchList}
          onSelect={this.props.onSelect}
          listWidth={this.props.listWidth || this.state.listWidth || 0}
          searchingFor={this.state.searchingFor}
          notFound={this.props.notFound}
        />
      </div>
    )
  }
}