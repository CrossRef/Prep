import React from 'react'
import is from 'prop-types'
import deployConfig from "../../../../deployConfig"
import {debounce} from '../../../utilities/helpers'


export default class CheckBox extends React.Component {

  static propTypes = {
    item: is.shape({
      name: is.string.isRequired,
      info: is.string.isRequired,
      percentage: is.number.isRequired
    }).isRequired,
    openTooltip: is.string,
    setOpenTooltip: is.func.isRequired,
    blank: is.bool
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
    if(this.props.blank) return
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
      const xPosition = this.icon.getBoundingClientRect().left

      if(windowWidth - (xPosition + 11) < 343) {
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

          {!this.props.blank &&
          <div className="tooltipIconContainer">

            <div
              className="hoverArea"
              style={{direction: tooltipRight ? 'ltr' : 'rtl'}}
              ref={ node => this.icon = node }
            >

              <div className="iconContainer">
                {!mobileTooltipOpen &&
                <img
                  className="icon"
                  style={{width: '22px', height: '22px'}}
                  src={`${deployConfig.baseUrl}assets/images/Asset_Icons_Grey_Help.png`}/>
                }

                <img
                  className="hoverIcon"
                  style={{width: '22px', height: '22px', display: mobileTooltipOpen ? 'inline' : 'none'}}
                  src={`${deployConfig.baseUrl}assets/images/Asset_Icons_LightGrey_Help.svg`}
                  onClick={mobile ? () => this.props.setOpenTooltip(name) : null}/>
              </div>


              <div
                className='tooltipHoverArea'
                style={{margin: tooltipRight ? "0 0 0 12px" : "0 12px 0 0"}}
              >

                <div
                  className={
                    `tooltipContentContainer ${
                    mobile ? 'mobileTooltip' : ''} ${
                    mobileTooltipOpen ? 'mobileTooltipOpen' : ''}`
                  }
                  style={{margin: tooltipRight ? "0 0 0 14px" : "0 14px 0 0"}}
                >
                  <div dangerouslySetInnerHTML={{__html: info}}/>

                  {mobile &&
                  <img
                    className="tooltipCloseButton"
                    style={{
                      position: 'absolute',
                      top: 6,
                      right: 6,
                      height:17,
                      width:17,
                      cursor: 'pointer'
                    }}
                    src={`${deployConfig.baseUrl}assets/images/Asset_Icons_Black_Close.svg`}
                    onClick={() => this.props.setOpenTooltip(undefined)}/>}

                  </div>
              </div>

            </div>
          </div>}

        </div>

        <div className="barContainer">
          <div className="bar">
            <div className="barWidth" style={{width: `${percentage}%`}}>
              <div className="animateBounce" style={{backgroundColor: "#3EB1CB"}}/>
            </div>
          </div>

          <div className="percent">{this.props.blank ? '' : percentage}<span>%</span></div>
        </div>
      </div>
    )
  }
}

