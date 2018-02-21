import React from 'react'
import is from 'prop-types'

import {prettyKeys} from '../../../utilities/helpers'
import deployConfig from "../../../../deployConfig"





export default class ContentTypeFilter extends React.Component {

  static propTypes = {
    filters: is.array.isRequired,
    currentFilter: is.string.isRequired,
    setFilter: is.func.isRequired
  }

  state = {
    menuOpen: false
  }


  render () {

    return (

      <div
        className='contentTypeFilter'
        onClick={() => this.setState((prevState) => ({menuOpen: !prevState.menuOpen}))}
        onBlur={() => this.setState({menuOpen: false})}
        tabIndex="0"
      >

        Content Type
        <img style={{width: "20px", height: "20px", marginTop: "-2px"}} src={`${deployConfig.baseUrl}/images/Asset_Icons_Grey_Chevron.png`}/>

        {this.state.menuOpen &&
          <div className="filterList">
            {this.props.filters.map( filter =>
              <div key={filter} className="filterButton" onClick={() => this.props.setFilter(filter)}>
                <div className="checkmark">

                  {filter === this.props.currentFilter &&
                  <img style={{width: "14px", height: "14px"}} src={`${deployConfig.baseUrl}/images/iconmonstr-check-mark-1.svg`}/>}

                </div>

                <div className="buttonText">

                  {prettyKeys(filter)}

                </div>
              </div>
            )}
          </div>
        }

      </div>
    )
  }
}