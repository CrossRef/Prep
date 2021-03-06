import React from 'react'

import deployConfig from '../../../deployConfig'
import Search from '../common/search'
import headlineText from '../../utilities/editableText/headlineText'
import testimonials from '../../utilities/editableText/testimonials'



export default class LandingPage extends React.Component {

  state={
    searchList: []
  }


  componentDidMount () {
    fetch(`${deployConfig.apiBaseUrl}?op=members`)
      .then( r => r.json())
      .then( r => this.setState({searchList: r.message}))
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
    this.props.history.push(`${deployConfig.baseUrl}${selection.id}`, {publisherName: selection.name})
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
              searchList={this.state.searchList}
              savedSearches={JSON.parse(localStorage.getItem('savedSearches'))}
              notFound="No matching member name found. Please try again."
              placeHolder='Search by member'/>
          </div>

        </div>

        <div className="content">

          <div className="moreInfoBar">
            <div className="moreInfoContent">

              <div className="button">
                <a href="https://www.crossref.org/participation" target="_blank">Learn more</a>
              </div>

              <div className="headlineTextHolder">
                <p className="smallText">{headlineText.homePage.smallText}</p>
                <p className="bigText">{headlineText.homePage.bigText}</p>
              </div>
            </div>

          </div>


          {/*<div className="testimonialContainer">

            <div className="testimonial">
              {testimonials.testimonial1}

            </div>

            <div className="testimonial">
              {testimonials.testimonial2}
            </div>

            <div className="testimonial">
              {testimonials.testimonial3}
            </div>

          </div>*/}
        </div>
      </div>
    )
  }
}
