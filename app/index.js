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

        </div>

        <div className="landingPage">
          <div className="topStripe">

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
              <div className="testimonial">“Our team deposit a lot of metadata. With metadata Reports we now have a central dashboard for viewing all our depositing activity.“</div>
              <div className="testimonial">“Metadata Reports meets our needs perfectly. For visualising and sharing metadata activity to all our organisation.”</div>
              <div className="testimonial">“Easy to use and super helpful, exactly what our team needed.”</div>
            </div>
          </div>
        </div>

        <div className="footer">footer</div>

      </div>
    )
  }
}