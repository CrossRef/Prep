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
    coverage: {},
    loadingChecks: true,
    tutorialOverlay: false,
    tutorialOverlayFadeIn: false,
  }


  componentDidMount () {
    fetch(`${deployConfig.apiBaseUrl}?op=participation-summary&memberid=${this.props.match.params.memberId}`)
      .then( r => r.json())
      .then( r => this.setState({totals: r.message.totals, coverage: r.message.Coverage, loadingChecks: false}))
      .catch( e =>{
        console.error(e)
        this.setState({loadingChecks: false})
      })
  }


  componentDidUpdate (prevProps, prevState) {
    if(!prevState.tutorialOverlay && this.state.tutorialOverlay) {
      this.setState({tutorialOverlayFadeIn: true})
    }
    if(prevState.tutorialOverlay && !this.state.tutorialOverlay) {
      this.setState({tutorialOverlayFadeIn: false})
    }
  }


  render() {
    const totals = this.state.totals
    const desktop = window.matchMedia("(min-width: 768px)").matches

    return (
      <div className="publisherPage">
        <div className="topStripe">
          <div className="widthContainer">

            <div className="topBar">
              <div className="button" onClick={() => this.props.history.push(`${deployConfig.baseUrl}`)}>Find a member</div>
              <div className="button">
                <a href="https://www.crossref.org/participation" target="_blank">Learn more</a>
              </div>
              <div className="tutorialIconContainer">
                {desktop &&
                  <img
                    src={`${deployConfig.baseUrl}assets/images/Asset_Icons_Lighter_Grey_Help.svg`}
                    className="tutorialIcon"
                    tabIndex="-1"
                    onBlur={() => this.setState({tutorialOverlay: false})}
                    onMouseDown={ () => this.setState( prevState => ({tutorialOverlay: !prevState.tutorialOverlay}))}/>}
              </div>

            </div>

            <div className="contentBox">

              <div className="leftBox">
                <p className="firstText">{headlineText.checksPage.smallText}</p>
                <p className="blueText">{headlineText.checksPage.bigText}</p>
              </div>

              <div className="rightBox">
                <div className="publisherTitle">
                  {this.props.location.state.publisherName}
                </div>

                <Totals totals={totals}/>

              </div>
            </div>
          </div>
        </div>

        <div className="publisherContent">

          <ChecksSection
            coverage={this.state.coverage}
            memberId={this.props.match.params.memberId}
            tutorialOverlay={this.state.tutorialOverlay}
            loadingChecks={this.state.loadingChecks}/>

          <div className={
            `tutorialOverlay ${
              this.state.tutorialOverlayFadeIn ? 'tutorialFadeIn' : ''}`
          }>
            <div className="tutorialBackground" />
          </div>


        </div>

      </div>
    )
  }
}



