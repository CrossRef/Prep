import React, {Fragment} from 'react'
import is from 'prop-types'

import CheckBox from "./checkBox"
import ContentTypeFilter from "./contentTypeFilter"
import {prettyKeys} from '../../../utilities/helpers'
import Search from "../../common/search"
import deployConfig from '../../../../deployConfig'







export default class ChecksSection extends React.Component {

  static propTypes = {
    coverage: is.object.isRequired,
    memberId: is.string.isRequired
  }


  state = {
    openTooltip: undefined,
    filter: 'Journal Article',
    titleFilter: undefined,
    titleSearchData: [],
    titleChecksData: undefined,
  }


  componentDidMount () {
    this.getSearchData()
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

    return fetch(`https://apps.crossref.org/prep-staging/data?op=publications&memberid=${this.props.memberId}&contenttype=${translateFilter[filter]}`)
      .then( r => r.json())
      .then( r => this.setState({titleSearchData: r.message}))
      .catch(e=>{
        console.error(e)
      })
  }


  selectTitle = (value, selection) => {
    this.setState({titleFilter: value})
    fetch(`https://apps.crossref.org/prep-staging/data?op=participation-summary&memberid=123&pubid=123`)
      .then( r => r.json())
      .then( r => this.setState({titleChecksData: r.message.titledata.Coverage}))
  }


  render () {
    const {filter, titleFilter, titleSearchData, titleChecksData} = this.state
    const {coverage} = this.props

    //TODO: Dummy data just to see filter working, need to remove once real data is available
    this.props.coverage.reports = [
      {name: 'Reports item 1', percentage: 15, info: 'some tooltip info'},
      {name: 'Reports item 2', percentage: 25, info: 'some tooltip info'},
      {name: 'Reports item 3', percentage: 65, info: 'some tooltip info'},
      {name: 'Reports item 4', percentage: 4, info: 'some tooltip info'},
      {name: 'Reports item 5', percentage: 9, info: 'some tooltip info'},
      {name: 'Reports item 6', percentage: 45, info: 'some tooltip info'},
      {name: 'Reports item 7', percentage: 97, info: 'some tooltip info'},
      {name: 'Reports item 8', percentage: 54, info: 'some tooltip info'},
      {name: 'Reports item 9', percentage: 44, info: 'some tooltip info'},
      {name: 'Reports item 10', percentage: 82, info: 'some tooltip info'},
      {name: 'Reports item 11', percentage: 3, info: 'some tooltip info'},
      {name: 'Reports item 12', percentage: 9, info: 'some tooltip info'},
    ]


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

          <div className={`filter publicationFilter ${this.state.titleFilter ? 'titleFilterActive' : ''}`}>

            {titleFilter ?
              <Fragment>
                {titleFilter}
                <img
                  className="titleFilterX"
                  src={`${deployConfig.baseUrl}assets/images/Asset_Icons_Black_Close.svg`}
                  onClick={()=>this.setState({titleFilter: undefined, titleChecksData: undefined})}/>
              </Fragment>
            :
              <Search
                searchData={titleSearchData}
                placeHolder="Search by Title"
                onSelect={this.selectTitle}
                listWidth={mobile ? 256 : 456}
                notFound="Not found in this content type"/>}
          </div>
          <div className="filter timeFilter">Last 12 months</div>
        </div>


        <div className="checksContainer">

          {(titleChecksData || coverage[filter] || []).map( item =>
            <CheckBox
              key={
                `${titleFilter ? `${titleFilter}-` : ''
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