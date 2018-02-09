import React from 'react'
import ReactDOM from 'react-dom'

import deployConfig from '../deployConfig'

document.addEventListener('DOMContentLoaded', () => {
  ReactDOM.render(
    <App/>,
    document.querySelector('#root')
  )
})


class App extends React.Component {
  render() {
    return (
      <div className="appContainer">
        <div className="header">
          <div className="widthContainer">
            <img style={{width: '140px', marginTop: '15px'}} src={`${deployConfig.baseUrl}/images/crossref-preport-logo-200-BETA.svg`}/>
            <img style={{width: '96px', marginTop: '15px'}} src={`${deployConfig.baseUrl}/images/Crossref_Logo_Stacked_RGB.svg`}/>
          </div>
        </div>

        <div className="landingPage">
          <div className="topStripe">

            <div className="searchContainer">
              <p className="searchTitle">
                Find a Publisher
                <p className="bannerText">How good is your metadata?</p>
              </p>

              <div className="searchInputHolder">
                <input className="searchInput" placeholder="Search by member"/>
              </div>
            </div>

          </div>

          <div className="content">

            <div className="greyBar">
                <img src={`${deployConfig.baseUrl}/images/light-bulb.svg`}/>
                <div className="greyBarContent">
                  <p className="smallText">Comprehensive metadata makes publications discoverable.</p>
                  <p className="bigText">Make sure your content can be found.</p>
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

        <div className="footer">
          <div className="widthContainer">
            <p className="crossref">Crossref</p>
            <p className="license">The content of this site is licensed under a Creative Commons Attribution 4.0 International License</p>
            <p className="privacy">Privacy</p>
          </div>
        </div>

      </div>
    )
  }
}