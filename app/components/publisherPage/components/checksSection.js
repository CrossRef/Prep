import React, {Fragment} from 'react'
import is from 'prop-types'

import CheckBox from "./checkBox"
import ChecksFilter from "./checksFilter"
import {prettyKeys, elipsize, debounce} from '../../../utilities/helpers'
import Search from "../../common/search"
import deployConfig from '../../../../deployConfig'




const translateDateFilter = {
  'All time': null,
  'Year to date': '2018'
}


export default class ChecksSection extends React.Component {

  static propTypes = {
    coverage: is.object.isRequired,
    memberId: is.string.isRequired
  }


  state = {
    openTooltip: undefined,
    filter: 'Journals',
    dateFilter: 'All time',
    titleFilter: undefined,
    titleSearchList: [],
    titleChecksData: undefined,
  }


  componentDidMount () {
    this.getSearchData()
    window.addEventListener('resize', this.debouncedUpdate);
  }


  componentWillUnmount () {
    window.removeEventListener('resize', this.debouncedUpdate);
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


  setDateFilter = (filterName) => {
    this.setState({dateFilter: filterName})

    const dateFilter = translateDateFilter[filterName]

    const baseApiUrl = 'https://apps.crossref.org/prep-staging/data?op=participation-summary'
    const member = `&memberid=${this.props.memberId}`
    const pubyear = dateFilter ? `&pubyear=${dateFilter}` : ''
    const pubid = this.state.titleFilter ? `&pubid=${this.state.titleFilter}` : ''

    fetch(baseApiUrl + member + pubyear + pubid)
      .then( r => r.json())
      .then( r => this.setState({titleChecksData: r.message.Coverage.Journals}))
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
    this.setState({titleFilter: value})

    const dateFilter = translateDateFilter[this.state.dateFilter]

    const baseApiUrl = 'https://apps.crossref.org/prep-staging/data?op=participation-summary'
    const member = `&memberid=${this.props.memberId}`
    const pubyear = dateFilter ? `&pubyear=${dateFilter}` : ''
    const pubid = `&pubid=${value}`

    fetch(baseApiUrl + member + pubyear + pubid)
      .then( r => r.json())
      .then( r => this.setState({titleChecksData: r.message.Coverage}))
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
            <ChecksFilter
              label={"Date range"}
              filters={Object.keys(translateDateFilter)}
              currentFilter={this.state.dateFilter}
              setFilter={this.setDateFilter}
            >
              <img style={{width: '22px'}} src={`${deployConfig.baseUrl}assets/images/Asset_Icons_Grey_Calandar.svg`}/>
            </ChecksFilter>
          </div>

        </div>


        <div className="checksContainer">

          {(titleChecksData || coverage[filter] || []).map( item =>
            <CheckBox
              key={
                `${titleChecksData ? `${titleFilter}-` : ''
                }${filter ? `${filter}-` : ''
                }${item.name}`
              }
              item={item}
              openTooltip={this.state.openTooltip}
              setOpenTooltip={this.setOpenTooltip}/>
          )}

        </div>
      </div>
    )
  }
}