import React from 'react'
import Autocomplete from 'react-autocomplete'

import deployConfig from '../../../../deployConfig'



export default class Search extends React.Component {

  state={
    focused: false,
    searchingFor: '',
    data: ['caltech', 'cambridge Core', 'crossref University Press', 'carnegie Mellon University', 'cambridge University Press', 'cornell University']
  }

  componentDidMount () {
    fetch('https://www.crossref.org/prep/data?op=members').then(r=>console.log(r)).catch(e=>console.error(e))
  }


  render () {
    let data = this.state.data.filter((item)=>item.includes(this.state.searchingFor))

    return (
      <Autocomplete
        value={this.state.searchingFor}
        items={data.length ? data : ['']}
        onSelect={ result => this.props.history.push(`${deployConfig.baseUrl}${result}`)}
        onChange={(e, value)=>this.setState({searchingFor: value})}
        renderItem={(item)=><div className='searchItem' key={item}>{item}</div>}
        getItemValue={(item)=>item}
        menuStyle={{
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