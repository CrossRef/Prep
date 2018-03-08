import React from 'react'

import deployConfig from '../../../deployConfig'
import Search from './components/search'
import headlineText from '../../utilities/editableText/headlineText'



export default class LandingPage extends React.Component {

  render() {
    return (
      <div className="landingPage">
        <div className="topStripe">

          <div className="searchContainer">
            <div className="searchTitle">
              Find a member
              <p className="bannerText">How good is your metadata?</p>
            </div>

            <Search history={this.props.history}/>
          </div>

        </div>

        <div className="content">

          <div className="greyBar">
            <img src={`${deployConfig.baseUrl}images/light-bulb.svg`}/>
            <div className="greyBarContent">
              <p className="smallText">{headlineText.smallText}</p>
              <p className="bigText">{headlineText.bigText}</p>
              <div className="button">Learn More</div>
            </div>

          </div>


          <div className="testimonialContainer">

            <div className="testimonial">
              <p className="testimonialBody">
                “Our team deposit a lot of metadata. With metadata Reports we now have a central dashboard for viewing all our depositing activity.“
              </p>
              <p className="testimonialAuthor">Laura Knight from SciMed Pub</p>
            </div>

            <div className="testimonial">
              <p className="testimonialBody">
                “Metadata Reports meets our needs perfectly. For visualising and sharing metadata activity to all our organisation.”
              </p>
              <p className="testimonialAuthor">Seth Jones from HyperNitro Pub</p>
            </div>

            <div className="testimonial">
              <p className="testimonialBody">
                “Easy to use and super helpful, exactly what our team needed.”
              </p>
              <pre className="testimonialAuthor">{`Jimmy Bone\nfrom Ultra LightSpeed Publications`}</pre>
            </div>

          </div>
        </div>
      </div>
    )
  }
}
