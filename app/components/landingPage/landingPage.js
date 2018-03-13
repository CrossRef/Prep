import React from 'react'

import deployConfig from '../../../deployConfig'
import Search from './components/search'
import headlineText from '../../utilities/editableText/headlineText'
import testimonials from '../../utilities/editableText/testimonials'



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
            <img src={`${deployConfig.baseUrl}assets/images/light-bulb.svg`}/>
            <div className="greyBarContent">
              <p className="smallText">{headlineText.smallText}</p>
              <p className="bigText">{headlineText.bigText}</p>
              <div className="button" onClick={() => this.props.history.push(`${deployConfig.baseUrl}info`)}>Learn More</div>
            </div>

          </div>


          <div className="testimonialContainer">

            <div className="testimonial">
              {testimonials.testimonial1}

            </div>

            <div className="testimonial">
              {testimonials.testimonial2}
            </div>

            <div className="testimonial">
              {testimonials.testimonial3}
            </div>

          </div>
        </div>
      </div>
    )
  }
}
