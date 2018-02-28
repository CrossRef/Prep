import React from 'react'
import is from 'prop-types'
import deployConfig from "../../../../deployConfig"
import {debounce} from '../../../utilities/helpers'


export default class CheckBox extends React.Component {

  static propTypes = {
    item: is.object.isRequired,
    openTooltip: is.string,
    setOpenTooltip: is.func.isRequired
  }

  state = {
    tooltipRight: true,
  }


  componentDidMount () {
    this.updateTooltipPosition()
    window.addEventListener('resize', this.debouncedUpdate);
  }


  componentWillUnmount () {
    window.removeEventListener('resize', this.debouncedUpdate);
  }


  updateTooltipPosition = () => {
    const windowWidth = window.innerWidth

    if(this.icon) {
      const xPosition = this.icon.getBoundingClientRect().x
      if(windowWidth - (xPosition + 11) < 343) {
        this.setState( prevState => prevState.tooltipRight ? {tooltipRight: false} : null)
      } else {
        this.setState( prevState => prevState.tooltipRight ? null : {tooltipRight: true})
      }
    }

    if(windowWidth > 639) {
      this.props.setOpenTooltip( undefined )
    }

    this.setState({}) //forceupdate so that render function refreshes based on new window width
  }


  debouncedUpdate = () => {
    debounce(this.updateTooltipPosition, 500, this)
  }


  render() {
    const {name, percentage, info} = this.props.item
    const tooltipRight = this.state.tooltipRight
    const mobile = window.matchMedia("(max-width: 639px)").matches

    const mobileTooltipOpen = this.props.openTooltip === name

    return (
      <div className="check">
        <div className="title">
          {name}
          <div className="tooltipIconContainer">
            <div className="hoverArea">
              <img
                onClick={mobile ? () => this.props.setOpenTooltip(name) : null}
                ref={ node => this.icon = node }
                style={{width: '22px', height: '22px'}}
                src={`${deployConfig.baseUrl}/images/Asset_Icons_Grey_Help.png`}/>

              {!mobile &&
                <div
                  className={
                    `tooltipHoverArea ${!tooltipRight ? 'tooltipHoverAreaLeft' : ''}`
                  }
                />
              }

              <div
                className={
                  `tooltipContentContainer ${!mobile && !tooltipRight ? 'tooltipContentContainerLeft' : ''
                  } ${mobile ? 'mobileTooltip' : ''} ${mobileTooltipOpen ? 'mobileTooltipOpen' : ''}`
                }
              >
                {info}
                {mobile &&
                  <p
                    style={{position: 'absolute', margin: 0, color: 'white', top: 3, right: 7, fontSize: 20}}
                    onClick={() => this.props.setOpenTooltip(undefined)}
                  >
                    X
                  </p>
                }
              </div>

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