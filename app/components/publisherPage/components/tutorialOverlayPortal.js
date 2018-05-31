import React from 'react'
import ReactDOM from 'react-dom'

export default class TutorialOverlayPortal extends React.Component {

  render () {
    return ReactDOM.createPortal(
      this.props.children,
      document.querySelector(".tutorialOverlay")
    )
  }
}