import React from 'react'
import is from 'prop-types'

import Totals from './components/totals'
import {prettyKeys} from '../../utilities/helpers'
import deployConfig from "../../../deployConfig"
import ChecksSection from './components/checksSection'
import headlineText from '../../utilities/editableText/headlineText'




export default class PublisherPage extends React.Component {

  static propTypes = {
    match: is.shape({
      params: is.shape({
        publisherName: is.string.isRequired
      }).isRequired
    }).isRequired,
    history: is.object.isRequired
  }


  state = {
    totals: {},
    coverage: {}
  }


  componentDidMount () {
    fetch(`https://apps.crossref.org/prep-staging/data?op=participation-summary&memberid=${this.props.match.params.memberId}`)
      .then( r => r.json())
      .then( r => this.setState({totals: r.message.totals, coverage: r.message.Coverage}))
      .catch(e=>{
        console.error(e)
      })
  }


  render() {
    const totals = this.state.totals

    return (
      <div className="publisherPage">
        <div className="topStripe">
          <div className="widthContainer">

            <div className="topBar">
              <div className="button" onClick={() => this.props.history.push(`${deployConfig.baseUrl}`)}>Find a member</div>
              <div className="button" onClick={() => this.props.history.push(`${deployConfig.baseUrl}info`)}>Learn more</div>
            </div>

            <div className="contentBox">

              <div className="leftBox">
                <p className="firstText">{headlineText.smallText}</p>
                <p className="blueText">{headlineText.bigText}</p>
              </div>

              <div className="rightBox">
                <div className="publisherTitle">
                  {decodeURIComponent(this.props.match.params.publisherName)}
                </div>

                <Totals totals={totals}/>

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



