import React from 'react'
import deployConfig from "../../../../deployConfig"


export const contentFilterTutorial =
  <div className="contentFilterTutorial">
    <img src={`${deployConfig.baseUrl}assets/images/Tutorial arrow left.svg`}/>
    <p className="tutorialText">View different content types<br/>(e.g. journal articles, book chapters)</p>
  </div>



export const titleSearchTutorial =
  <div className="titleSearchTutorial">
    <img src={`${deployConfig.baseUrl}assets/images/Tutorial arrow right.svg`}/>
    <p className="tutorialText">Select an individual journal when you are in the "journal articles" content type</p>
  </div>



export const dateFilterTutorial =
  <div className="dateFilterTutorial">
    <img src={`${deployConfig.baseUrl}assets/images/Tutorial arrow left.svg`}/>
    <p className="tutorialText">Move between current content (published in the last two years and year to date) and back file</p>
  </div>