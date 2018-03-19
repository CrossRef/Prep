import React from 'react'
import is from 'prop-types'
import Autocomplete from 'react-autocomplete'
import { List, CellMeasurer, CellMeasurerCache } from 'react-virtualized';
const Fuse = require('fuse.js')

import deployConfig from '../../../deployConfig'
import SearchMenu from './searchMenu'




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

    this.state = {
      focused: false,
      searchingFor: '',
      data: Array.isArray(props.searchData) ? props.searchData : [],
      listWidth: props.listWidth
    }
  }


  componentWillReceiveProps (nextProps) {
    this.setState({data: nextProps.searchData})
  }


  render () {
    let data
    if(!this.state.searchingFor && this.props.savedSearches) {
      data = this.props.savedSearches
    } else {
      if(!this.state.searchingFor) {
        data = []
      } else {
        data = this.state.data

        // if(!data.length) {
        //   data = this.props.notFound ? [{name: this.props.notFound, notFound: true}] : []
        // }
      }
    }


    return (
      <div className='searchInputHolder'>

        <input
          className={`searchInput ${this.state.focused ? 'searchFocused' : ''}`}
          onFocus={()=>{
            this.setState({focused: true})
          }}
          onBlur={()=>{
            this.setState({focused: false})
          }}
          placeholder={`${this.state.focused ? '' : this.props.placeHolder}`}
          onChange={(e)=> {
            this.setState({searchingFor: e.target.value})
          }}
          value={this.state.searchingFor}
        />

        <SearchMenu
          data={data}
          onSelect={this.props.onSelect}
          listWidth={this.state.listWidth || 500}
          searchingFor={this.state.searchingFor}
          notFound={this.props.notFound}/>
      </div>
    )
  }

}

{/*<Autocomplete*/}
  {/*renderInput={this.renderInput}*/}
  {/*renderItem={this.renderItem}*/}
  {/*items={data}*/}
  {/*getItemValue={ item => item.name }*/}

  {/*value={this.state.searchingFor}*/}
  {/*onChange={(e, value)=> this.setState({searchingFor: value})}*/}
  {/*onSelect={this.props.onSelect}*/}

  {/*renderMenu={this.renderMenu}*/}

  {/*wrapperProps={{*/}
    {/*className: 'searchInputHolder',*/}
    {/*style:{}*/}
  {/*}}*/}
{/*/>*/}