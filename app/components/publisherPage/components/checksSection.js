import React from 'react'
import is from 'prop-types'

import CheckBox from "./checkBox"
import ContentTypeFilter from "./contentTypeFilter"
import {prettyKeys} from '../../../utilities/helpers'







export default class ChecksSection extends React.Component {

  static propTypes = {
    coverage: is.object.isRequired
  }


  state = {
    openTooltip: undefined,
    filter: 'journal-articles'
  }


  setOpenTooltip = (selection) => {
    this.setState( prevState => prevState.openTooltip === selection ? null : {openTooltip: selection})
  }


  setFilter = (filter) => {
    this.setState({filter})
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

          <div className="filter publicationFilter">Publication Filter</div>
          <div className="filter timeFilter">Last 12 months</div>
        </div>


        <div className="checksContainer">

          {(this.props.coverage['journal-articles'] || []).map( item =>
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