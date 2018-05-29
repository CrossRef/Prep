import React from 'react'
import ReactDOM from 'react-dom'

export default class TutorialOverlayPortal extends React.Component {

  state = {
    postMount: false
  }

  componentDidMount () {
    this.setState({postMount: true})
  }

  render () {
    //The portal has to render postMount, because on the first mount render, the .tutorialOverlay div to which
    //this portal passes the children to render is not yet available.

    return this.state.postMount
      ? ReactDOM.createPortal(
          this.props.children,
          document.querySelector(".tutorialOverlay")
        )
      : null
  }
}