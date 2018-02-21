import React from 'react'
import is from 'prop-types'

import {prettyKeys} from '../../../utilities/helpers'
import deployConfig from "../../../../deployConfig"





export default class ContentTypeFilter extends React.Component {

  static propTypes = {
    filters: is.array.isRequired
  }


  render () {

    return (

      <div className='contentTypeFilter'>
        Content Type
        <img style={{width: "20px", height: "20px", marginTop: "-2px"}} src={`${deployConfig.baseUrl}/images/Asset_Icons_Grey_Chevron.png`}/>

        <div className="filterList">
          {this.props.filters.map( filter =>
            <div key={filter} className="filterButton">
              <div className="checkmark">
                <img style={{width: "14px", height: "14px"}} src={`${deployConfig.baseUrl}/images/iconmonstr-check-mark-1.svg`}/>
              </div>

              <div className="buttonText">
                {prettyKeys(filter)}
                </div>
            </div>
          )}
        </div>
      </div>
    )
  }
}