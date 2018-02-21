import React from 'react'
import deployConfig from "../../../../deployConfig"





export default class ContentTypeFilter extends React.Component {



  render () {

    return (

      <div className='contentTypeFilter'>
        Content Type
        <img style={{width: "20px", height: "20px", marginTop: "-2px"}} src={`${deployConfig.baseUrl}/images/Asset_Icons_Grey_Chevron.png`}/>

        <div className="filterList"></div>
      </div>
    )
  }
}