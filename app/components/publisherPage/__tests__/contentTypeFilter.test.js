import React from 'react';
import Enzyme, { shallow, mount, render } from 'enzyme';
import toJson from 'enzyme-to-json';
import sinon from 'sinon'
import ContentTypeFilter from "../components/contentTypeFilter"





//Dummy Data



//Mocks
const sandbox = sinon.sandbox.create()
const setState = sandbox.spy(ContentTypeFilter.prototype, 'setState')




//Render and begin tests
const shallowComponent = shallow(<ContentTypeFilter />)




test('shallow snapshot', () => {
  
})


describe('open filter menu', () => {
  test('menu should render', () => {
    
  })
  
  test('default filter should be checked', () => {

  })
})


describe('select a filter', () => {
  test('check if blur handler is called using Jquery', () => {

  })

  test('new filter has checkmark', () => {

  })
})