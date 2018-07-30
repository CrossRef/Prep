import React from 'react'
import is from 'prop-types'

import {prettyKeys} from '../../utilities/helpers'
import deployConfig from "../../../deployConfig"
import ChecksSection from './components/checksSection'
import headlineText from '../../utilities/editableText/headlineText'




export default class PublisherPage extends React.Component {

  static propTypes = {
    match: is.shape({
      params: is.shape({
        memberId: is.string.isRequired
      }).isRequired
    }).isRequired,

    location: is.shape({
      state: is.shape({
        publisherName: is.string.isRequired
      })
    }),

    history: is.object.isRequired
  }


  state = {
    totals: {},
    allTotals:{},
    coverage: {},
    loadingChecks: true,
    publisherName:""
  }
  constructor (props) {
    super()
    var message;
    if(!props.location.state) {
      fetch(`${deployConfig.apiBaseUrl}?op=members`)
      .then( r => r.json())
      .then( r => message=r.message)
      .then (()=>this.setState({publisherName:message[ message.findIndex(member => {return member.id===this.props.match.params.memberId})].name}))      
      .catch( e =>{
        console.error(e)
      })      
    }
        
  }
  componentDidMount () {  
    fetch(`${deployConfig.apiBaseUrl}?op=participation-summary&memberid=${this.props.match.params.memberId}`)
      .then( r => r.json())
      .then( r => this.setState({allTotals: r.message.totals, coverage: r.message.Coverage, loadingChecks: false}))
      .catch( e =>{
        console.error(e)
        this.setState({loadingChecks: false})
      })
  }

reloadTotals = (filterTotals) => {
  this.setState( prevState => prevState.totals === filterTotals ? null : {totals: filterTotals})
}


  render() {
    const totals = this.state.totals

    return (
      <div className="publisherPage">
        <div className="topStripe">
          <div className="widthContainer">

            <div className="topBar">
              <div className="button" onClick={() => this.props.history.push(`${deployConfig.baseUrl}`)}>Find a member</div>
              <div className="button">
                <a href="https://www.crossref.org/participation" target="_blank">Learn more</a>
              </div>
            </div>

            <div className="contentBox">

              <div className="leftBox">
                <p className="topText">{headlineText.checksPage.smallText}</p>
                <p className="bottomText">{headlineText.checksPage.bigText}</p>
              </div>

              <div className="rightBox">
                <div className="publisherTitle">
                {this.props.location.state ? this.props.location.state.publisherName :this.state.publisherName }
                </div>

                <div className="publisherTotals">
                  <p className="totalNumber">
                    {Object.keys(totals).reduce( (sum, key) => sum + totals[key], 0).toLocaleString()}
                  </p>
                  <p className="totalText">Total registered content items</p>
                </div>

              </div>
            </div>

            <div className="totals">
              {Object.keys(totals).map((key) =>
                totals[key]
                  ? <p key={key}>{prettyKeys(key)} <span>{totals[key].toLocaleString()}</span></p>
                  : null
              )}
            </div>
          </div>
        </div>

        <div className="publisherContent">

          <ChecksSection
            coverage={this.state.coverage}
            memberId={this.props.match.params.memberId}
            tutorialOverlay={this.state.tutorialOverlay}
            loadingChecks={this.state.loadingChecks}
            totals={this.state.allTotals}
            setTotals={this.reloadTotals}/>
            
        </div>

      </div>
    )
  }
}



