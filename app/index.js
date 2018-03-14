import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter as Router, Switch, Redirect, withRouter } from 'react-router-dom';
import 'whatwg-fetch'

import deployConfig from '../deployConfig'
import MainContainer from './components/mainContainer/mainContainer'
import LandingPage from './components/landingPage/landingPage'
import PublisherPage from './components/publisherPage/publisherPage'
import LearnMorePage from './components/learnMorePage/learnMorePage'


document.addEventListener('DOMContentLoaded', () => {
  ReactDOM.render(
    renderApp(),
    document.querySelector('#root')
  )
})

function renderApp () {
  return (
    <Router>
      <OnNavigationWrapper>
        <Switch>
          <MainContainer exact path={`${deployConfig.baseUrl}`} Component={LandingPage}/>
          <MainContainer exact path={`${deployConfig.baseUrl}:publisherName/:memberId`} Component={PublisherPage}/>
          <MainContainer exact path={`${deployConfig.baseUrl}info`} Component={LearnMorePage}/>
          <Redirect to={`${deployConfig.baseUrl}`} />
        </Switch>
      </OnNavigationWrapper>
    </Router>
  )
}



class OnNavigation extends React.Component {
  componentWillReceiveProps(nextProps) {
    if (this.props.location.pathname !== nextProps.location.pathname) {
      window.scrollTo(0, 0)
    }
  }

  render() {
    return this.props.children
  }
}

const OnNavigationWrapper = withRouter(OnNavigation)