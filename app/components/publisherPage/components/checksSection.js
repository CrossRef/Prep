import React, {Fragment} from 'react'
import is from 'prop-types'

import CheckBox from "./checkBox"
import ChecksFilter from "./checksFilter"
import {prettyKeys, elipsize, debounce} from '../../../utilities/helpers'
import Search from "../../common/search"
import deployConfig from '../../../../deployConfig'




const translateDateFilter = {
  'All time': null,
  '2018': '2018',
  '2017': '2017',
  '2016': '2016'
}


export default class ChecksSection extends React.Component {

  static propTypes = {
    coverage: is.object.isRequired,
    memberId: is.string.isRequired,
    loadingChecks: is.bool.isRequired
  }

  constructor () {
    super ()

    const defaultContent = 'Journals'
    const defaultDate = 'All time'

    this.generateKey = (contentFilter, dateFilter, titleFilter) => {
      return `${contentFilter}-${dateFilter}${titleFilter ? `-${titleFilter}` : ''}`
    }

    this.state = {
      openTooltip: undefined,
      filter: defaultContent,
      dateFilter: defaultDate,
      titleFilter: undefined,
      titleSearchList: [],
      titleChecksData: undefined,
      dateChecksData: undefined,
      loadingFilter: false,
      loadingStage: 0,
      keySig: this.generateKey(defaultContent, defaultDate)
    }
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
    this.setState( prevState => ({filter, keySig: this.generateKey(filter, prevState.dateFilter)}))
    this.getSearchData(filter)
  }


  setDateFilter = (filterName) => {
    const dateQuery = translateDateFilter[filterName]

    const baseApiUrl = 'https://apps.crossref.org/prep-staging/data?op=participation-summary'
    const member = `&memberid=${this.props.memberId}`
    const pubyear = dateQuery ? `&pubyear=${dateQuery}` : ''
    const pubid = this.state.titleFilter ? `&pubid=${this.state.titleFilter}` : ''

    this.setState({dateFilter: filterName, loadingFilter: !!(pubid || dateQuery)})
    this.startLoadingTimeout()

    if(pubid) {
      fetch(baseApiUrl + member + pubyear + pubid)
        .then( r => r.json())
        .then( r => {
          clearTimeout(this.loadingTimeout)

          this.setState( prevState => ({
            titleChecksData: r.message.Coverage,
            loadingFilter: false,
            loadingStage: 0,
            keySig: this.generateKey(prevState.filter, filterName, prevState.titleFilter)
          }))
        })
    }

    if(dateQuery) {
      fetch(baseApiUrl + member + pubyear)
        .then( r => r.json())
        .then( r => {
          const setStatePayload = {dateChecksData: r.message.Coverage}

          if(!pubid) {
            clearTimeout(this.loadingTimeout)
            setStatePayload.loadingFilter = false
            setStatePayload.loadingStage = 0
            setStatePayload.keySig = this.generateKey(this.state.filter, filterName)
          }

          this.setState(setStatePayload)
        })

    } else {
      clearTimeout(this.loadingTimeout)
      this.setState( prevState => ({
        dateChecksData: undefined,
        loadingFilter: false,
        loadingStage: 0,
        keySig: pubid ? prevState.keySig : this.generateKey(prevState.filter, filterName, prevState.titleFilter)
      }))
    }
  }


  getSearchData = (filter = this.state.filter) => {
    fetch(`https://apps.crossref.org/prep-staging/data?op=publications&memberid=${this.props.memberId}&contenttype=${filter}`)
      .then( r => r.json())
      .then( r => this.setState({titleSearchList: r.message}))
      .catch(e=>{
        console.error(e)
      })
  }


  selectTitle = (value, selection) => {
    this.setState({titleFilter: value, loadingFilter: true})
    this.startLoadingTimeout()

    const dateQuery = translateDateFilter[this.state.dateFilter]

    const baseApiUrl = 'https://apps.crossref.org/prep-staging/data?op=participation-summary'
    const member = `&memberid=${this.props.memberId}`
    const pubyear = dateQuery ? `&pubyear=${dateQuery}` : ''
    const pubid = `&pubid=${value}`

    fetch(baseApiUrl + member + pubyear + pubid)
      .then( r => r.json())
      .then( r => {
        clearTimeout(this.loadingTimeout)

        this.setState( prevState => ({
          titleChecksData: r.message.Coverage,
          loadingFilter: false,
          loadingStage: 0,
          keySig: this.generateKey(prevState.filter, prevState.dateFilter, value)
        }))
      })
  }


  cancelTitleFilter = () => {
    this.setState( prevState => ({
      titleFilter: undefined,
      titleChecksData: undefined,
      keySig: this.generateKey(prevState.filter, prevState.dateFilter)
    }))
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

          <p className="pleaseWait">Please wait, we are collecting your data.</p>
        </div>}

      </Fragment>


    )
  }


  render () {
    const {filter, titleFilter, titleSearchList, titleChecksData, dateChecksData} = this.state
    const {coverage} = this.props

    const mobile = window.matchMedia("(max-width: 639px)").matches

    return (
      <div className="checksSection">
        <div className="titleBar">
          {`Content type: ${prettyKeys(filter)}`}
        </div>


        <div className="filters">

          <ChecksFilter
            label={'Content type'}
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
                  onClick={this.cancelTitleFilter}/>
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
            <ChecksFilter
              label={"Date range"}
              filters={Object.keys(translateDateFilter).reverse()}
              currentFilter={this.state.dateFilter}
              setFilter={this.setDateFilter}
            >
              <img style={{width: '22px'}} src={`${deployConfig.baseUrl}assets/images/Asset_Icons_Grey_Calandar.svg`}/>
            </ChecksFilter>
          </div>

        </div>

        <div style={{display: 'flex', justifyContent: 'center'}}>
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

              {(titleChecksData || (dateChecksData && dateChecksData[filter]) || coverage[filter]).map( item =>
                <CheckBox
                  key={`${this.state.keySig}-${item.name}`}
                  item={item}
                  openTooltip={this.state.openTooltip}
                  setOpenTooltip={this.setOpenTooltip}
                />
              )}
            </div>
          }
        </div>


      </div>
    )
  }
}

const bc = {name: '', percentage: 0, info: ''}
const blankChecks = [bc, bc, bc, bc, bc, bc, bc, bc, bc, bc, bc, bc]