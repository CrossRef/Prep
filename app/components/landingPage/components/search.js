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
    const savedSearches = localStorage.getItem('savedSearches')
    if(savedSearches) {
      this.setState({savedSearches: JSON.parse(savedSearches)})
    }
    fetch('https://apps.crossref.org/prep-staging/data?op=members')
      .then( r => r.json())
      .then( r => this.setState({data: r.message}))
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
    return <div className='searchItem' key={item.id}>{item.name}</div>
  }


  render () {
    let data
    if(!this.state.searchingFor && this.state.savedSearches) {
      data = this.state.savedSearches
    } else {
      data = this.state.data.filter((item)=>item.name && item.name.toLowerCase().includes(this.state.searchingFor.toLowerCase()))
      if(!data.length) {
        data = []
      }
    }

    return (
      <Autocomplete
        renderInput={this.renderInput}
        renderItem={(this.renderItem)}
        items={data}
        getItemValue={ item => item.name }

        value={this.state.searchingFor}
        onChange={(e, value)=> this.setState({searchingFor: value})}
        onSelect={this.onSelect}

        menuStyle={{
          display: (this.state.searchingFor && data.length) || (!this.state.searchingFor && this.state.savedSearches) ? 'initial' : 'none',
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

        wrapperProps={{
          className: 'searchInputHolder',
          style:{}
        }}
      />
    )
  }

}