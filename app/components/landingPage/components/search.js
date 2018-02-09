import React from 'react'




export default class Search extends React.Component {

  state={
    focused: false
  }

  render () {
    return (
        <input
          className={`searchInput ${this.state.focused ? 'searchFocused' : ''}`}
          onFocus={()=>this.setState({focused: true})}
          onBlur={()=>this.setState({focused: false})}
          placeholder={`${this.state.focused ? '' : 'Search by member'}`}/>
      )
  }

}