import React from 'react'
import is from 'prop-types'
import deployConfig from "../../../../deployConfig"
import {debounce} from '../../../utilities/helpers'


export default class CheckBox extends React.Component {

  static propTypes = {
    item: is.shape({
      name: is.string.isrequired,
      info: is.string.isRequired,
      percentage: is.number.isRequired
    }).isRequired,
    openTooltip: is.string,
    setOpenTooltip: is.func.isRequired
  }


  constructor(prop) {
    super()

    this.state = {
      tooltipRight: true,
    }

    //Binding instead of using arrow functions for testing - allows spying prototype before mount to test if it was called on mount
    this.updateTooltipPosition = this.updateTooltipPosition.bind(this)
  }


  componentDidMount () {
    const onMount = true
    this.updateTooltipPosition(onMount)
    window.addEventListener('resize', this.debouncedUpdate);
  }


  componentWillUnmount () {
    window.removeEventListener('resize', this.debouncedUpdate);
  }


  updateTooltipPosition (onMount) {
    const windowWidth = window.innerWidth
    if(this.icon) {
      const xPosition = this.icon.getBoundingClientRect().x
      if(windowWidth - (xPosition + 11) < 500) {
        this.setState( prevState => prevState.tooltipRight ? {tooltipRight: false} : null)
      } else {
        this.setState( prevState => prevState.tooltipRight ? null : {tooltipRight: true})
      }
    }

    if(!onMount) {
      if(windowWidth > 639 && this.props.openTooltip === this.props.item.name) {
        this.props.setOpenTooltip( undefined )
      } else {
        this.setState({}) //forceupdate so that render function refreshes based on new window width
      }
    }
  }


  debouncedUpdate = () => {
    debounce(this.updateTooltipPosition, 500, this)
  }


  render() {
    const {name, percentage, info} = this.props.item
    const tooltipRight = this.state.tooltipRight
    const mobile = window.matchMedia("(max-width: 639px)").matches

    const mobileTooltipOpen = mobile ? this.props.openTooltip === name : false

    return (
      <div className="check">
        <div className="title">
          {name}
          <div className="tooltipIconContainer">
            <div className="hoverArea" ref={ node => this.icon = node }>

              {!mobileTooltipOpen &&
                <img
                  className="icon"
                  style={{width: '22px', height: '22px'}}
                  src={`${deployConfig.baseUrl}assets/images/Asset_Icons_Grey_Help.png`}/>}

              <img
                className="hoverIcon"
                style={{width: '22px', height: '22px', display: mobileTooltipOpen ? 'inline' : 'none'}}
                src={`${deployConfig.baseUrl}assets/images/Asset_Icons_LightGrey_Help.svg`}
                onClick={mobile ? () => this.props.setOpenTooltip(name) : null}/>


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
                <p>{info}</p>

                {mobile &&
                  <img
                    className="tooltipCloseButton"
                    style={{
                      position: 'absolute',
                      top: 6,
                      right: 6,
                      height:20,
                      width:20,
                      cursor: 'pointer'
                    }}
                    src={`${deployConfig.baseUrl}assets/images/Asset_Icons_White_Close.svg`}
                    onClick={() => this.props.setOpenTooltip(undefined)}/>
                }
              </div>

            </div>
          </div>

        </div>

        <div className="barContainer">
          <div className="bar">
            <div className="barWidth" style={{width: `${percentage}%`}}>
              <div className="animateBounce" style={{backgroundColor: "#3EB1CB"}}/>
            </div>
          </div>

          <div className="percent">{percentage}<span>%</span></div>
        </div>
      </div>
    )
  }
}