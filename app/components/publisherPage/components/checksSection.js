import React, {Fragment} from 'react'
import is from 'prop-types'

import CheckBox from "./checkBox"
import ContentTypeFilter from "./contentTypeFilter"
import {prettyKeys, elipsize, debounce} from '../../../utilities/helpers'
import Search from "../../common/search"
import deployConfig from '../../../../deployConfig'







export default class ChecksSection extends React.Component {

  static propTypes = {
    coverage: is.object.isRequired,
    memberId: is.string.isRequired,
    loadingChecks: is.bool.isRequired
  }


  state = {
    openTooltip: undefined,
    filter: 'Journals',
    titleFilter: undefined,
    titleSearchList: [],
    titleChecksData: undefined,
    loadingFilter: false,
    loadingStage: 0
  }


  componentDidMount () {
    this.getSearchData()
    this.startLoadingTimeout()
    window.addEventListener('resize', this.debouncedUpdate);
  }


  componentWillUnmount () {
    window.removeEventListener('resize', this.debouncedUpdate);
  }


  startLoadingTimeout = () => {
    this.loadingTimeout = setTimeout(()=>{
      this.setState({loadingStage: 1})
    }, 1000)
  }


  componentWillReceiveProps (nextProps) {
    if(!nextProps.loadingChecks && this.props.loadingChecks) {
      clearTimeout(this.loadingTimeout)
      this.setState({loadingStage: 0})
    }
  }


  debouncedUpdate = () => {
    debounce(()=>this.setState({}), 500, this)
  }


  setOpenTooltip = (selection) => {
    this.setState( prevState => prevState.openTooltip === selection ? null : {openTooltip: selection})
  }


  setFilter = (filter) => {
    this.setState({filter})
    this.getSearchData(filter)
  }


  getSearchData = (filter = this.state.filter) => {
    const translateFilter = {
      'Journal Article': 'Journal',
      'books': 'books'
    }

    return fetch(`https://apps.crossref.org/prep-staging/data?op=publications&memberid=${this.props.memberId}&contenttype=${filter}`)
      .then( r => r.json())
      .then( r => this.setState({titleSearchList: r.message}))
      .catch(e=>{
        console.error(e)
      })
  }


  selectTitle = (value, selection) => {
    this.setState({titleFilter: value, loadingFilter: true})
    this.startLoadingTimeout()

    fetch(`https://apps.crossref.org/prep-staging/data?op=participation-summary&memberid=${this.props.memberId}&pubid=${value}`)
      .then( r => r.json())
      .then( r => {
        clearTimeout(this.loadingTimeout)
        this.setState({titleChecksData: r.message.Coverage, loadingFilter: false, loadingStage: 0})
      })
  }


  renderLoader = () => {
    return (
      <Fragment>
        <div
          style={{
            position: 'absolute',
            top:0,bottom:0,left:0,right:0,
            backgroundColor: 'white',
            opacity: '.7',
            marginBottom: '21px',
            zIndex: 10
          }}/>

        {this.state.loadingStage === 1 &&
        <div
          style={{
            position: 'absolute',
            top: -15,
            width: '86%',
            height: '150px',
            backgroundColor: 'lightGrey',
            zIndex: 11,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <img
            className="loadThrobber"
            style={{height: '70px'}}
            src={`${deployConfig.baseUrl}assets/images/Asset_Load_Throbber_Load Throbber Teal.svg`}/>

          <p className="pleaseWait">Please wait, collecting data for you.</p>
        </div>}

      </Fragment>


    )
  }


  render () {
    const {filter, titleFilter, titleSearchList, titleChecksData} = this.state
    const {coverage} = this.props

    const mobile = window.matchMedia("(max-width: 639px)").matches

    return (
      <div className="checksSection">
        <div className="titleBar">
          {`Content type: ${prettyKeys(filter)}`}
        </div>


        <div className="filters">

          <ContentTypeFilter
            filters={Object.keys(coverage)}
            currentFilter={filter}
            setFilter={this.setFilter}
            inactive={!!titleFilter}
          />

          <div
            className={
              `filter publicationFilter ${
              titleFilter ? 'titleFilterActive' : ''} ${
              this.state.filter !== 'Journals' ? 'inactivePublicationFilter' : ''}`
            }>

            {titleFilter ?
              <Fragment>
                <div style={{maxWidth: '200px', maxHeight: '30px', overflow: 'hidden'}}>
                  {elipsize(titleFilter, 55)}
                </div>

                <img
                  className="titleFilterX"
                  src={`${deployConfig.baseUrl}assets/images/Asset_Icons_Black_Close.svg`}
                  onClick={()=>this.setState({titleFilter: undefined, titleChecksData: undefined})}/>
              </Fragment>
            :
              <Search
                searchList={titleSearchList}
                placeHolder="Search by Title"
                onSelect={this.selectTitle}
                listWidth={mobile ? 256 : 456}
                notFound="Not found in this content type"/>}
          </div>

          <div className="timeFilterContainer">
            <div className="timeFilter filter">Last 12 months</div>
          </div>

        </div>


        {this.props.loadingChecks ?
          <div className="checksContainer">
            {this.renderLoader()}

            {blankChecks.map( (item, index) =>
              <CheckBox key={index} item={item} setOpenTooltip={this.setOpenTooltip} blank={true}/>
            )}
          </div>
        :
          <div className="checksContainer">
            {this.state.loadingFilter && this.renderLoader()}

            {(titleChecksData || coverage[filter]).map( item =>
              <CheckBox
                key={
                  `${titleChecksData ? `${titleFilter}-` : ''
                    }${filter ? `${filter}-` : ''
                    }${item.name}`
                }
                item={item}
                openTooltip={this.state.openTooltip}
                setOpenTooltip={this.setOpenTooltip}
              />
            )}
          </div>
        }


      </div>
    )
  }
}

const bc = {name: '', percentage: 0, info: ''}
const blankChecks = [bc, bc, bc, bc, bc, bc, bc, bc, bc, bc, bc, bc]