import React from 'react'

import deployConfig from '../../../deployConfig'
import Search from '../common/search'



export default class LandingPage extends React.Component {

  state={
    searchData: []
  }


  componentDidMount () {
    fetch('https://apps.crossref.org/prep-staging/data?op=members')
      .then( r => r.json())
      .then( r => this.setState({searchData: r.message}))
      .catch(e=>{
        console.error(e)
      })
  }


  onSelect = (value, selection) => {
    let savedSearches = JSON.parse(localStorage.getItem('savedSearches'))

    if(!savedSearches) {
      savedSearches = [selection]

    } else {
      let savedIndex
      const alreadySaved = savedSearches.some( (savedItem, i) => {
        if(savedItem.id === selection.id && savedItem.name === selection.name) {
          savedIndex = i
          return true
        }
      })

      if(alreadySaved) {
        savedSearches.splice(savedIndex, 1)
        savedSearches.unshift(selection)

      } else {
        if(savedSearches.length === 6) {
          savedSearches.pop()
        }
        savedSearches.unshift(selection)
      }
    }

    localStorage.setItem('savedSearches', JSON.stringify(savedSearches))
    this.props.history.push(`${deployConfig.baseUrl}${encodeURIComponent(selection.name)}/${selection.id}`)
  }


  render() {
    return (
      <div className="landingPage">
        <div className="topStripe">

          <div className="searchContainer">
            <div className="searchTitle">
              Find a member
              <p className="bannerText">How good is your metadata?</p>
            </div>

            <Search
              onSelect={this.onSelect}
              searchData={this.state.searchData}
              savedSearches={JSON.parse(localStorage.getItem('savedSearches'))}
              placeHolder='Search by member'/>
          </div>

        </div>

        <div className="content">

          <div className="greyBar">
            <img src={`${deployConfig.baseUrl}assets/images/light-bulb.svg`}/>
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
    )
  }
}
