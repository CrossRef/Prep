import React from 'react'
import is from 'prop-types'

import {prettyKeys} from "../../../utilities/helpers"





Totals.propTypes = {
  totals: is.object
}


export default function Totals ({totals}) {

  const total = Object.keys(totals).reduce( (sum, key) => sum + totals[key], 0)

  return (
    <div className="publisherTotals">
      <div className="totalTooltip">
        {Object.keys(totals).map((key) => totals[key] ? <p key={key}>{`${prettyKeys(key)}: ${totals[key].toLocaleString()}`}</p> : null)}
      </div>
      <div className="tooltipHoverArea">
        {Object.keys(totals).map((key) => totals[key] ? <p key={key}>{`${prettyKeys(key)}: ${totals[key].toLocaleString()}`}</p> : null)}
      </div>

      <p className="totalNumber">{total.toLocaleString()}</p>
      <p className="totalText">Total registered content items</p>
    </div>
  )
}