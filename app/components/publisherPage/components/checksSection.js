import React, {Fragment} from 'react'
import is from 'prop-types'

import CheckBox from "./checkBox"
import ChecksFilter from "./checksFilter"
import {prettyKeys, debounce} from '../../../utilities/helpers'
import Search from "../../common/search"
import deployConfig from '../../../../deployConfig'
import TutorialOverlayPortal from './tutorialOverlayPortal'
import {contentFilterTutorial, titleSearchTutorial, dateFilterTutorial} from './tutorialDivs'




const translateDateFilter = {
  'All time': null,
  'Current content': 'current',
  'Back file': 'backfile'
}
const defaultContent = 'Journal articles'
const defaultDate = 'Current content'


export default class ChecksSection extends React.Component {

  static propTypes = {
    coverage: is.object.isRequired,
    memberId: is.string.isRequired,
    loadingChecks: is.bool.isRequired,
    tutorialOverlay: is.bool.isRequired
  }


  constructor () {
    super ()

    this.generateKey = (contentFilter, dateFilter, titleFilter) => {
      return `${contentFilter}-${dateFilter}${titleFilter ? `-${titleFilter}` : ''}`
    }

    this.state = {
      openTooltip: undefined,
      contentFilter: defaultContent,
      dateFilter: defaultDate,
      titleFilter: undefined,
      issnFilter:undefined,
      titleSearchList: [],
      titleChecksData: undefined,
      dateChecksData: undefined,
      loadingFilter: false,
      loadingStage: 0,
      keySig: this.generateKey(defaultContent, defaultDate),
      coverageError: false,
      filterError: false
    }
  }


  componentDidMount () {
    this.getTitleSearchData()
    this.startLoadingTimeout()
    this.setDateFilter(defaultDate)
    window.addEventListener('resize', this.debouncedUpdate);
  }


  getTitleSearchData = (contentFilter = defaultContent ) => {
    fetch(`${deployConfig.apiBaseUrl}?op=publications&memberid=${this.props.memberId}&contenttype=${contentFilter}`)
      .then( r => r.json())
      .then( r => this.setState({titleSearchList: r.message}))
      .catch(e=>{
        console.error(e)
      })
  }


  startLoadingTimeout = () => {
    this.loadingTimeout = setTimeout(()=>{
      this.setState({loadingStage: 1})
    }, 1000)
  }


  debouncedUpdate = () => {
    debounce(()=>this.setState({}), 500, this)
  }


  componentWillUnmount () {
    window.removeEventListener('resize', this.debouncedUpdate);
  }


  componentWillReceiveProps (nextProps) {
    if(!nextProps.loadingChecks && this.props.loadingChecks) {
      clearTimeout(this.loadingTimeout)
      this.setState({loadingStage: 0})
    }

    if(this.props.loadingChecks && !nextProps.loadingChecks) {
      const nextCoverage = Object.keys(nextProps.coverage)

      if(
        nextCoverage.length &&
        !nextProps.coverage[this.state.contentFilter]
      ) {
        const newFilter = nextCoverage[0]
        this.setState({contentFilter: newFilter})

      } else if (
        !nextCoverage.length
      ) {
        this.setState({coverageError: true})
      }
    }
  }


  setFilter = (contentFilter) => {
    this.setState( prevState => ({
      contentFilter,
      keySig: this.generateKey(contentFilter, prevState.dateFilter),
      filterError: false
    }))
  }


  setDateFilter = (filterName) => {
    const dateQuery = translateDateFilter[filterName]

    const baseApiUrl = `${deployConfig.apiBaseUrl}?op=participation-summary`
    const member = `&memberid=${this.props.memberId}`
    const pubyear = dateQuery ? `&pubyear=${dateQuery}` : ''
    const pubid = this.state.titleFilter ? `&pubid=${this.state.issnFilter}` : ''

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
            keySig: this.generateKey(prevState.contentFilter, filterName, prevState.titleFilter),
            filterError: !r.message.Coverage.length
          }))
        })
        .catch( e => {
          console.error(e)
          clearTimeout(this.loadingTimeout)
          this.setState({loadingStage: 0, loadingFilter: false, filterError: true})
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
            setStatePayload.keySig = this.generateKey(this.state.contentFilter, filterName)
            setStatePayload.filterError = !r.message.Coverage[this.state.contentFilter]
          }

          this.setState(setStatePayload)
        })
        .catch( e => {
          console.error(e)

          if(!pubid) {
            clearTimeout(this.loadingTimeout)
            this.setState({
              loadingFilter: false,
              loadingStage: 0,
              filterError: true
            })
          }
        })

    } else {
      clearTimeout(this.loadingTimeout)
      this.setState( prevState => ({
        dateChecksData: undefined,
        loadingFilter: false,
        loadingStage: 0,
        keySig: pubid ? prevState.keySig : this.generateKey(prevState.contentFilter, filterName, prevState.titleFilter)
      }))
    }
  }


  selectTitleFilter = (value, selection) => {
    const issn = selection.pissn?selection.pissn:selection.eissn
    this.setState({titleFilter: value, loadingFilter: true,issnFilter: issn})
    this.startLoadingTimeout()

    const dateQuery = translateDateFilter[this.state.dateFilter]

    const baseApiUrl = `${deployConfig.apiBaseUrl}?op=participation-summary`
    const member = `&memberid=${this.props.memberId}`
    const pubyear = dateQuery ? `&pubyear=${dateQuery}` : ''
    const pubid = `&pubid=${issn}`

    fetch(baseApiUrl + member + pubyear + pubid)
      .then( r => r.json())
      .then( r => {
        clearTimeout(this.loadingTimeout)

        this.setState( prevState => ({
          titleChecksData: r.message.Coverage,
          loadingFilter: false,
          loadingStage: 0,
          keySig: this.generateKey(prevState.contentFilter, prevState.dateFilter, value),
          filterError: !r.message.Coverage.length
        }))
      })
      .catch( e => {
        console.error(e)
        clearTimeout(this.loadingTimeout)
        this.setState({loadingFilter: false, loadingStage: 0, filterError: true})
      })
  }


  cancelTitleFilter = () => {
    this.setState( prevState => {
      const newState = {}

      if(prevState.dateChecksData && !prevState.dateChecksData[prevState.contentFilter]) {
        newState.filterError = true
      }

      newState.titleFilter = undefined
      newState.issnFilter = undefined
      newState.titleChecksData = undefined
      newState.keySig = this.generateKey(prevState.contentFilter, prevState.dateFilter)

      return newState
    })
  }


  setOpenTooltip = (selection) => {
    this.setState( prevState => prevState.openTooltip === selection ? null : {openTooltip: selection})
  }


  renderLoader = () => {
    return (
      <Fragment>
        <div style={this.state.filterError ? {top: 0} : null} className="loadWhiteScreen"/>

        {this.state.loadingStage === 1 &&
          <div className="loadingStage1">
            <img
              className="loadThrobber"
              style={{height: '60px'}}
              src={`${deployConfig.baseUrl}assets/images/Asset_Load_Throbber_Load Throbber Teal.svg`}/>

            <p className="pleaseWait">Please wait, we are collecting your data.</p>
          </div>}

      </Fragment>
    )
  }


  renderFilters = (tutorialOverlay) => {
    const {contentFilter, titleFilter, titleSearchList, dateChecksData} = this.state
    const {coverage} = this.props

    return (
      <div className="filters">

        <ChecksFilter
          label={'Content type'}
          filters={Object.keys(dateChecksData ? dateChecksData : coverage)}
          currentFilter={contentFilter}
          setFilter={this.setFilter}
          inactive={!!titleFilter}
          tutorial={tutorialOverlay ? contentFilterTutorial : undefined}
        />

        <div style={{flex: 1, display: 'flex', alignItems: 'center'}}>
          <div
            className={
              `filter publicationFilter ${
                titleFilter ? 'titleFilterActive' : ''} ${
                this.state.contentFilter !== 'Journal articles' ? 'inactivePublicationFilter' : ''}`
            }>

            {titleFilter
              ? <Fragment>
                  <div className="titleFilterText">
                    {titleFilter}
                  </div>

                  <img
                    className="titleFilterX"
                    src={`${deployConfig.baseUrl}assets/images/Asset_Icons_Black_Close.svg`}
                    onClick={this.cancelTitleFilter}/>
                </Fragment>

              : <Search
                  searchList={titleSearchList}
                  placeHolder="Search by title"
                  onSelect={this.selectTitleFilter}
                  addWidth={2}
                  notFound="Not found in this content type"/>}

            {tutorialOverlay && titleSearchTutorial}
          </div>
        </div>


        <div className="timeFilterContainer">
          <ChecksFilter
            label={"Publication date"}
            filters={Object.keys(translateDateFilter)}
            currentFilter={this.state.dateFilter}
            setFilter={this.setDateFilter}
            tutorial={portal ? dateFilterTutorial : undefined}
          >
            <img style={{width: '22px'}} src={`${deployConfig.baseUrl}assets/images/Asset_Icons_Grey_Calandar.svg`}/>
          </ChecksFilter>
        </div>

      </div>
    )
  }


  render () {
    const {contentFilter, titleChecksData, dateChecksData} = this.state
    const {coverage, tutorialOverlay} = this.props

    return (
      <div className="checksSection">
        <div className="titleBar">
          {`Content type: ${prettyKeys(contentFilter)}`}
        </div>

        {tutorialOverlay &&
          <TutorialOverlayPortal>
            {this.renderFilters(tutorialOverlay)}
          </TutorialOverlayPortal>}

        {this.renderFilters()}

        {this.state.coverageError || this.state.filterError
          ? <div className="coverageError">
              {this.renderLoader()}
              {this.state.coverageError && <div>No content has been registered for this member.</div>}
              {this.state.filterError && <div>No content has been registered for the selected filters.</div>}
            </div>

          : <Fragment>
              {this.props.loadingChecks

                ? <div className="checksWidthContainer">
                    {this.renderLoader()}

                    <div className="checksContainer">

                      {blankChecks.map( (item, index) =>
                        <CheckBox key={index} item={item} setOpenTooltip={this.setOpenTooltip} blank={true}/>
                      )}
                    </div>
                  </div>

                : <div className="checksWidthContainer">
                    {this.state.loadingFilter && this.renderLoader()}

                    <div className="checksContainer">

                      {(titleChecksData || (dateChecksData && dateChecksData[contentFilter]) || coverage[contentFilter]).map( item =>
                        <CheckBox
                          key={`${this.state.keySig}-${item.name}`}
                          item={item}
                          openTooltip={this.state.openTooltip}
                          setOpenTooltip={this.setOpenTooltip}
                        />
                      )}
                    </div>
                  </div>
              }
            </Fragment>
        }
      </div>
    )
  }
}

const bc = {name: '', percentage: 0, info: ''}
const blankChecks = [bc, bc, bc, bc, bc, bc, bc, bc, bc, bc, bc, bc]
