import React from 'react'
import is from 'prop-types'
import Autocomplete from 'react-autocomplete'

import deployConfig from '../../../../deployConfig'



export default class Search extends React.Component {

  static propTypes = {
    history: is.shape({
      push: is.func.isRequired
    }).isRequired
  }

  state={
    focused: false,
    searchingFor: '',
    data: [],
    savedSearches: undefined
  }

  componentDidMount () {
    this.setState({savedSearches: JSON.parse(localStorage.getItem('savedSearches'))})
    fetch('https://www.crossref.org/prep/data?op=members')
      .then( r => this.setState({data: r.message}))
      .catch(e=>console.error(e))
  }





  render () {
    let data
    if(!this.state.searchingFor && this.state.savedSearches) {
      data = this.state.savedSearches
    } else {
      data = this.state.data.filter((item)=>item.name && item.name.includes(this.state.searchingFor))
      if(!data.length) {
        data = ['no results found...']
      }
    }

    return (
      <Autocomplete
        value={this.state.searchingFor}
        items={data}
        onSelect={ result => this.props.history.push(`${deployConfig.baseUrl}${item.name}/${item.id}`)}
        onChange={(e, value)=>this.setState({searchingFor: value})}
        renderItem={(item)=><div className='searchItem' key={item.id}>{item.name}</div>}
        getItemValue={ item => item }
        menuStyle={{
          display: this.state.searchingFor || this.state.savedSearches ? 'initial' : 'none',
          backgroundColor: 'white',
          padding: '13px 0 0 0',
          borderRadius: '0',
          boxShadow: 'none',
          position: 'absolute',
          overflow: 'auto',
          maxHeight: '207px',
          top: '48px',
          left: 'auto',
          border: '1px black solid'
        }}
        renderInput={(props)=>{
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
        }}
        wrapperProps={{
          className: 'searchInputHolder',
          style:{}
        }}
      />
    )
  }

}