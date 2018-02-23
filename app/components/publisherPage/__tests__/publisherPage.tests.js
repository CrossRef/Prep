import React from 'react';
import Enzyme, { shallow, mount, render } from 'enzyme';
import toJson from 'enzyme-to-json';
import sinon from 'sinon'


import PublisherPage from '../publisherPage'



//Dummy Data
const participationSummary = {
  message: {
    "current-year": true,
    "totals": {
      "books": 1234,
        "conference-papers": 123,
        "reports": 123,
        "datasets": 0,
        "dissertations": 0,
        "posted-content": 0,
        "standards": 0
    },
    "Coverage": []
  }
}




//Mocks
const sandbox = sinon.sandbox.create()
global.fetch = sandbox.stub().callsFake(() => Promise.resolve({json: () => participationSummary}));
const didMount = sandbox.spy(PublisherPage.prototype, 'componentDidMount')
const setState = sandbox.spy(PublisherPage.prototype, 'setState')

const history = {
  push: sandbox.stub()
}



//Render and begin tests
const mountComponent = mount(<PublisherPage match={{params: {publisherName: 'publisher name'}}}/>)


test('mount snapshot', () => {
  expect(didMount.callCount).toBe(1)
  expect(toJson(mountComponent)).toMatchSnapshot()
})


describe('componentDidMount', () => {
  test('should get totals from api', () => {
    expect(global.fetch.callCount).toBe(1)
    expect(setState.args[0][0]).toEqual({totals: participationSummary.message.totals})
    expect(mountComponent.state('totals')).toEqual(participationSummary.message.totals)
  })
})


describe('navigation buttons', () => {
  test('should navigate back to search', () =>{
    mountComponent.find('.topBar').children().first().prop('onClick')()
    expect(history.push.callCount).toBe(1)
  })
})