import React from 'react'
import is from 'prop-types'
import deployConfig from "../../../../deployConfig"
import {debounce} from '../../../utilities/helpers'


export default class CheckBox extends React.Component {

  static propTypes = {
    item: is.object.isRequired
  }

  state = {
    tooltipRight: true
  }


  componentDidMount () {
    this.updateTooltipPosition()
    window.addEventListener('resize', this.debouncedUpdate);
  }


  updateTooltipPosition = () => {
    if(this.icon) {
      const xPosition = this.icon.getBoundingClientRect()['x']
      const windowWidth = window.innerWidth
      if(windowWidth - (xPosition + 11) < 343) {
        this.setState( prevState => prevState.tooltipRight ? {tooltipRight: false} : null)
      } else {
        this.setState( prevState => prevState.tooltipRight ? null : {tooltipRight: true})
      }
    }
  }


  debouncedUpdate = () => {
    debounce(this.updateTooltipPosition, 500, this.timeout)
  }


  componentWillUnmount () {
    window.removeEventListener('resize', this.debouncedUpdate);
  }


  render() {
    const {name, percentage, info} = this.props.item

    return (
      <div className="check">
        <div className="title">
          {name}
          <div className="tooltipIconContainer">
            <div className="hoverArea">
              <img
                ref={ node => this.icon = node }
                style={{width: '22px', height: '22px'}}
                src={`${deployConfig.baseUrl}/images/Asset_Icons_Grey_Help.png`}/>

              <div className={`tooltipHoverArea ${!this.state.tooltipRight ? 'tooltipHoverAreaLeft' : ''}`} />
              <div className={`tooltipContentContainer ${!this.state.tooltipRight ? 'tooltipContentContainerLeft' : ''}`}>{info}</div>
            </div>
          </div>

        </div>

        <div className="barContainer">
          <div className="bar">
            <div style={{
              width: `${percentage}%`,
              height: "100%",
              backgroundColor: "#3EB1CB"
            }}/>
          </div>

          <div className="percent">{percentage}<span>%</span></div>
        </div>
      </div>
    )
  }
}