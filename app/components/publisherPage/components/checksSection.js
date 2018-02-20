import React from 'react'
import is from 'prop-types'




export default class ChecksSection extends React.Component {


  render () {
    console.log(this.props.coverage)

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

          {(this.props.coverage['journal-articles'] || []).map(({name, percentage, info}) =>
            <div className="check">
              <div className="title">{name}</div>

              <div className="barContainer">
                <div className="bar">
                  <div style={{
                    width: `${percentage}%`,
                    height: "100%",
                    backgroundColor: "#3EB1CB"
                  }}/>
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