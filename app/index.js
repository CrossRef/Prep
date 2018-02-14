import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter as Router, Switch, Redirect } from 'react-router-dom';

import deployConfig from '../deployConfig'
import MainContainer from './components/mainContainer/mainContainer'
import LandingPage from './components/landingPage/landingPage'
import PublisherPage from './components/publisherPage/publisherPage'


document.addEventListener('DOMContentLoaded', () => {
  ReactDOM.render(
    renderApp(),
    document.querySelector('#root')
  )
})

function renderApp () {
  return (
    <Router>
      <Switch>
        <MainContainer exact path={`${deployConfig.baseUrl}`} Component={LandingPage}/>
        <MainContainer exact path={`${deployConfig.baseUrl}:publisherName/:memberId`} Component={PublisherPage}/>
        <Redirect to={`${deployConfig.baseUrl}`} />
      </Switch>
    </Router>
  )
}
