import React from 'react'
import is from 'prop-types'

import CheckBox from "./checkBox"
import ContentTypeFilter from "./contentTypeFilter"
import {prettyKeys} from '../../../utilities/helpers'
import Search from "../../common/search"







export default class ChecksSection extends React.Component {

  static propTypes = {
    coverage: is.object.isRequired,
    memberId: is.string.isRequired
  }


  state = {
    openTooltip: undefined,
    filter: 'journal-articles',
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
      'journal-articles': 'Journal',
      'books': 'books'
    }

    return fetch(`https://apps.crossref.org/prep-staging/data?op=publications&memberid=${this.props.memberId}&contenttype=${translateFilter[filter]}`)
      .then( r => r.json())
      .then( r => this.setState({titleSearchData: r.message}))
      .catch(e=>{
        console.error(e)
      })
  }


  render () {
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
          {`Content type: ${prettyKeys(this.state.filter)}`}
        </div>


        <div className="filters">

          <ContentTypeFilter
            filters={Object.keys(this.props.coverage)}
            currentFilter={this.state.filter}
            setFilter={this.setFilter}
          />

          <div className="filter publicationFilter">
            <Search
              searchData={this.state.titleSearchData}
              placeHolder="Search by Title"
              onSelect={()=>{}}
              listWidth={mobile ? 256 : 456}
              notFound="Not found in this content type"/>
          </div>
          <div className="filter timeFilter">Last 12 months</div>
        </div>


        <div className="checksContainer">

          {(this.props.coverage[this.state.filter] || []).map( item =>
            <CheckBox
              key={item.name}
              item={item}
              openTooltip={this.state.openTooltip}
              setOpenTooltip={this.setOpenTooltip}/>
          )}

        </div>
      </div>
    )
  }
}