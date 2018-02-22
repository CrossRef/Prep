import React from 'react'
import is from 'prop-types'

import {prettyKeys} from '../../../utilities/helpers'



export default class ChartSection extends React.Component {

  static propTypes = {
    totals: is.array.isRequired
  }


  render () {
    let highTotal = 0
    const totalsArray = this.props.totals.map( yearData => {
      const total = Object.keys(yearData.totals).reduce((sum, key) => sum + yearData.totals[key], 0)
      if(total > highTotal) {
        highTotal = total
      }

      return { ...yearData, total }
    })

    const roundTarget = 5 * (10**(String(highTotal).length - 2))

    const scaleEnd = Math.ceil(highTotal/roundTarget) * roundTarget

    const xLineArray = [0, scaleEnd/5, scaleEnd/5*2, scaleEnd/5*3, scaleEnd/5*4, scaleEnd]

    return (
      <div className="chartSection">

        <div className="title">All registered content items (last 10 years)</div>


        <div className="legend">
          {Object.keys(barColors).map( key => {
            return (
              <div className="legendItem" key={key}>
                <div className="square" style={{backgroundColor: barColors[key]}}/>
                {prettyKeys(key)}
              </div>
            )
          })}

        </div>


        <div className="chartDiv">

          <div className="xAxisAbsoluteContainer">
            <div className="xAxis">
              {xLineArray.map( num =>
                <div key={num} className="xGridPosition">

                  <div className="xGrid" />
                  <div className="xGridNumber">{num > 999 ? (num/1000).toFixed(0) + 'k' : num}</div>

                </div>
              )}
            </div>
          </div>


          <div className="barContainer">
            {totalsArray.map( yearData => {
              const year = yearData.year
              const breakdown = yearData.totals

              return (
                <div className="bar" key={year}>
                  <div className="year">{year}</div>
                  {Object.keys(breakdown).map( key => {
                    const itemTotal = breakdown[key]
                    if(itemTotal) {
                      const percentage = itemTotal / scaleEnd * 100
                      return <div  key={key} className="barSection" style={{backgroundColor: barColors[key], width: `${percentage}%`}}/>
                    } else return null
                  })}
                </div>
              )
            })}
          </div>

        </div>
      </div>
    )
  }
}


const barColors = {
  "journal-articles": "#ffcf9d",
  "books": "#FFE882",
  "conference-papers": "#E4D48E",
  "reports": "#F09290",
  "datasets": "#949494",
  "dissertations": "#78D2CB",
  "posted-content": "#B1E9E5",
  "standards": "#D7D2C4"
}

