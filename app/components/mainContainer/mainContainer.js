import React from 'react'
import { Route } from 'react-router-dom';

import deployConfig from '../../../deployConfig'



export default class MainContainer extends React.Component {

  render() {
    const {Component, ...rest} = this.props

    return (
      <Route {...rest} render={ routeProps =>
        <div className="appContainer">

          <div className="header">
            <div className="widthContainer">
              <img
                style={{width: '140px', marginTop: '15px'}}
                src={`${deployConfig.baseUrl}assets/images/crossref-preport-logo-200-BETA.svg`}/>

              <a href={'http://www.crossref.org'} target="_blank">
                <img
                  style={{width: '96px', marginTop: '15px'}}
                  src={`${deployConfig.baseUrl}assets/images/Crossref_Logo_Stacked_RGB.svg`}/>
              </a>
            </div>
          </div>

          <Component {...routeProps} />

          <div className="footer">
            <div className="widthContainer">

              <p className="crossref"><a target="_blank" href="http://crossref.org">Crossref</a></p>

              <p className="license">
                {'The content of this site is licensed under a '}
                <a target="_blank" href="https://creativecommons.org/licenses/by/4.0/">
                   Creative Commons Attribution 4.0
                  International License
                </a>
              </p>

              <p className="privacy">
                <a target="_blank" href="http://crossref.org/privacy">Privacy</a>
              </p>

            </div>
          </div>

        </div>
      }/>
    )
  }
}