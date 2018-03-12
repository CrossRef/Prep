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
    filter: 'Journal Article'
  }


  setOpenTooltip = (selection) => {
    this.setState( prevState => prevState.openTooltip === selection ? null : {openTooltip: selection})
  }


  setFilter = (filter) => {
    this.setState({filter})
  }


  render () {

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

          {(this.props.coverage[this.state.filter] || []).map( item =>
            <CheckBox
              key={this.state.filter + '-' + item.name}
              item={item}
              openTooltip={this.state.openTooltip}
              setOpenTooltip={this.setOpenTooltip}/>
          )}

        </div>
      </div>
    )
  }
}