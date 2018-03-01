import React from 'react'
import is from 'prop-types'

import ContentTypeFilter from "./contentTypeFilter"





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
          <ContentTypeFilter />
          <div className="filter publicationFilter">Publication Filter</div>
          <div className="filter timeFilter">Last 12 months</div>
        </div>


        <div className="checksContainer">

          {(this.props.coverage['journal-articles'] || []).map(({name, percentage, info}) =>
            <div className="check" key={name}>
              <div className="title">{name}</div>

              <div className="barContainer">
                <div className="bar">
                  <div className="barWidth" style={{width: `${percentage}%`}}>
                    <div className="animateBounce" style={{backgroundColor: "#3EB1CB"}}/>
                  </div>
                </div>

                <div className="percent">{percentage}<span>%</span></div>
              </div>
            </div>
          )}

        </div>
      </div>
    )
  }
}