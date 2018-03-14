import React from 'react'
import deployConfig from "../../../deployConfig"






export default class LearnMorePage extends React.Component {

  render() {
    return(
      <div className="learnMorePage">
        <div className="topStripe">

          <div className="widthContainer">
            <div className="topBar">
              <div className="button" onClick={() => this.props.history.push(`${deployConfig.baseUrl}`)}>Find a member</div>
              <div className="button">Learn more</div>
            </div>
            <div className="contentBox">

              <div className="leftBox">
                <img src={`${deployConfig.baseUrl}images/browser-asset-1.png`} style={{maxWidth: "486px", width: '100%', height: "auto"}}/>
              </div>

              <div className="rightBox">
                <p className="firstText">Comprehensive metadata makes publications discoverable.</p>
                <p className="blueText">Make sure your content can be found.</p>
              </div>
            </div>
          </div>

        </div>


        <div className="infoSection">

          <div className="whiteSection">
            <div className="leftSide"/>
            <div className="rightSide">
              <div className="textSection">
                <p className='boldText'>Learn more about Participation Reports</p>
                <p className='mainText'>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
              </div>
            </div>
          </div>


          <div className="orangeSection">
            <div className="leftSide">
              <div className="textSection">
                <p className='boldText'>What problem does Participation Reports solve?</p>
                <p className='mainText' style={{maxWidth: "353px"}}>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
              </div>
            </div>

            <div className="rightSide">
              <img src={`${deployConfig.baseUrl}images/cog_globe.svg`} style={{height: '370px', width: '224px'}}/>
            </div>
          </div>


          <div className="blueSection">
            <div className="leftSide">
              <img src={`${deployConfig.baseUrl}images/laptop_icon.svg`} style={{height: '350px', width: '224px'}}/>
            </div>

            <div className="rightSide">
              <div className="textSection">
                <p className='boldText'>How does Participation Reports work?</p>
                <p className='mainText' style={{maxWidth: "353px"}}>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    )
  }
}