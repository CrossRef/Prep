import React from 'react';
import Enzyme, { shallow, mount, render } from 'enzyme';
import toJson from 'enzyme-to-json';
import sinon from 'sinon'


import CheckBox from '../components/checkBox'



//Dummy Data




//Mocks
const sandbox = sinon.sandbox.create()
const didMount = sandbox.spy(CheckBox.prototype, 'componentDidMount')
const setState = sandbox.spy(CheckBox.prototype, 'setState')






//Render and begin tests
const mountComponent = mount(<CheckBox/>)


test('mount snapshot', () => {
  expect(didMount.callCount).toBe(1)
  expect(toJson(mountComponent)).toMatchSnapshot()
})


describe('componentDidMount', () => {
  test('should update tooltip positioning and add event listener', () => {

  })
})


describe('desktop or wide tablet', () => {
  test('if component on left side, tooltip on right', () => {

  })

  test('if component on right side, tooltip on left', () => {

  })

  test('resizing window small enough switches tooltip to left', () => {

  })

  test('resizing window big enough, switches tooltip to right', () => {

  })
})


describe('on mobile', () => {
  test('tooltip has special mobile styling', () => {

  })

  test('tooltip visible on icon click', () => {

  })

  test('tooltip closes on icon click or close button', () => {

  })
})


describe('componentWillUnmount', () => {
  test('should remove event listener', () => {

  })
})