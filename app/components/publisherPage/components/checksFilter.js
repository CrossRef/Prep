import React from 'react'
import is from 'prop-types'

import {prettyKeys} from '../../../utilities/helpers'
import deployConfig from "../../../../deployConfig"





export default class ChecksFilter extends React.Component {

  static propTypes = {
    filters: is.array.isRequired,
    currentFilter: is.string.isRequired,
    setFilter: is.func.isRequired,
    inactive: is.bool,
    label: is.string.isRequired
  }

  state = {
    menuOpen: false
  }


  render () {

    return (

      <div
        className={`checksFilter ${this.props.inactive ? 'inactiveFilter' : ''}`}
        onClick={() => this.setState((prevState) => ({menuOpen: !prevState.menuOpen}))}
        onBlur={() => this.setState({menuOpen: false})}
        tabIndex="0"
      >
        {this.props.children}

        <p style={{margin: this.props.children ? "0 0 0 10px" : "0 0 0 16px"}}>{this.props.label}</p>

        <img
          style={{width: "20px", height: "20px", position: 'absolute', right: this.props.children ? '10px' : '14px'}}
          src={`${deployConfig.baseUrl}assets/images/Asset_Icons_Grey_Chevron.png`}/>

        {this.state.menuOpen &&
        <div className="filterList">

          {this.props.filters.map( filter =>
          <div key={filter} id={`${filter}_button`} className="filterButton" onClick={() => this.props.setFilter(filter)}>
            <div className="checkmark">

              {filter === this.props.currentFilter &&
              <img id={`${filter}_checkmark`} style={{width: "14px", height: "14px"}} src={`${deployConfig.baseUrl}assets/images/iconmonstr-check-mark-1.svg`}/>}

            </div>

            <div className="buttonText">

              {prettyKeys(filter)}

            </div>
          </div>)}

        </div>}

      </div>
    )
  }
}