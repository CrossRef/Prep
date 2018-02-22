import React from 'react'



export default class ChartSection extends React.Component {


  render () {
    const xLineArray = [3000, 6000, 9000, 12000, 15000]

    return (
      <div className="chartSection">
        <div className="title">All registered content items (last 10 years)</div>
        <div className="legend"></div>
        <div className="chartDiv">

          <div className="xAxisAbsoluteContainer">
            <div className="xAxis">
              {xLineArray.map( n =>
                <div className="xGridPosition">

                  <div className="xGrid" />
                  <div className="xGridNumber">{n}</div>

                </div>
              )}
            </div>
          </div>

          <div className="barContainer">

            <div className="bar">
              <div className="year">2017</div>
              <div className="barSection" style={{backgroundColor: "red", width: "28%"}}/>
              <div className="barSection" style={{backgroundColor: "green", width: "12%"}}/>
              <div className="barSection" style={{backgroundColor: "blue", width: "41%"}}/>
            </div>





          </div>




        </div>
      </div>
    )
  }
}