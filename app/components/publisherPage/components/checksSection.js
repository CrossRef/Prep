import React from 'react'
import is from 'prop-types'

import CheckBox from "./checkBox"




export default class ChecksSection extends React.Component {

  static propTypes = {
    coverage: is.object.isRequired
  }

  render () {
    return (
      <div className="checksSection">
        <div className="titleBar">
          Content type: Journal articles
        </div>


        <div className="filters">
          <div className="filter">Content Type Filter</div>
          <div className="filter">Publication Filter</div>
          <div className="filter">Last 12 months</div>
        </div>


        <div className="checksContainer">

          {(this.props.coverage['journal-articles'] || []).map( item => <CheckBox key={item.name} item={item}/>)}

        </div>
      </div>
    )
  }
}