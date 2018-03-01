import React from 'react';
import Enzyme, { shallow, mount, render } from 'enzyme';
import toJson from 'enzyme-to-json';
import sinon from 'sinon'
import ChecksSection from "../components/checksSection"





//Dummy Data
const coverage = {
  'journal-articles': [
    {name: 'ja item 1', percentage: 15, info: 'some tooltip info'},
    {name: 'ja item 2', percentage: 25, info: 'some tooltip info'},
  ],

  'books': [
    {name: 'books item 1', percentage: 15, info: 'some tooltip info'},
    {name: 'books item 2', percentage: 25, info: 'some tooltip info'},
    {name: 'books item 2', percentage: 25, info: 'some tooltip info'},
  ]
}


//Mocks
const sandbox = sinon.sandbox.create()
const setState = sandbox.spy(ChecksSection.prototype, 'setState')



//Render and begin tests
const shallowComponent = shallow(<ChecksSection coverage={coverage}/>)



test('shallow snapshot', () => {
  expect(toJson(shallowComponent)).toMatchSnapshot()
})


describe('filter is set to new value', () => {
  let newFilter = 'books'


  test('new checks are rendered', () => {
    const instance = shallowComponent.instance()
    instance.setFilter(newFilter)
    expect(setState.callCount).toBe(1)
    shallowComponent.update()
    const checks = shallowComponent.find('CheckBox')
    expect(checks.length).toBe(coverage[newFilter].length)
    expect(toJson(shallowComponent)).toMatchSnapshot()
  })

  test('titleBar filter type text updated', () => {
    expect(shallowComponent.find('.titleBar').text()).toBe(`Content type: Books`)
  })
})
