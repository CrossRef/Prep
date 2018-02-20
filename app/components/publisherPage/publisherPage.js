import React from 'react'
import is from 'prop-types'

import {prettyKeys} from '../../utilities/helpers'
import ChecksSection from './components/checksSection'




export default class PublisherPage extends React.Component {

  static propTypes = {
    match: is.shape({
      params: is.shape({
        publisherName: is.string.isRequired
      }).isRequired
    }).isRequired
  }


  state = {
    totals: {},
    coverage: {}
  }


  componentDidMount () {
    fetch(`https://apps.crossref.org/prep-staging/data?op=participation-summary&memberid=${this.props.match.params.memberId}`)
      .then( r => r.json())
      .then( r => this.setState({totals: r.message.totals, coverage: r.message.Coverage[0]}))
      .catch(e=>{
        console.error(e)
      })
  }


  render() {
    const totals = this.state.totals
    const total = Object.keys(totals).reduce( (sum, key) => sum + totals[key], 0)

    return (
      <div className="publisherPage">
        <div className="topStripe">
          <div className="widthContainer">

            <div className="topBar">
              <div className="button">Find publisher</div>
              <div className="button">Learn more</div>
            </div>

            <div className="contentBox">

              <div className="leftBox">
                <p className="firstText">Comprehensive metadata makes publications discoverable.</p>
                <p className="blueText">Make sure your content can be found.</p>
              </div>

              <div className="rightBox">
                <div className="publisherTitle">
                  {decodeURIComponent(this.props.match.params.publisherName)}
                </div>

                <div className="totals">
                  <div className="totalTooltip">
                    {Object.keys(totals).map((key) => totals[key] ? <p key={key}>{`${prettyKeys(key)}: ${totals[key].toLocaleString()}`}</p> : null)}
                  </div>

                  <p className="totalNumber">{total.toLocaleString()}</p>
                  <p className="totalText">Total registered content items</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <ChecksSection coverage={this.state.coverage}/>

        <div className="chartSection">
          Chart goes here
        </div>
      </div>
    )
  }
}



