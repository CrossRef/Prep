import React from 'react'


export default class PublisherPage extends React.Component {

  render() {
    console.log(this.props)

    return (
      <div style={{height: "500px"}}>Publisher: {this.props.match.params.publisherId}</div>
    )
  }
}