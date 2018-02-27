import React from 'react';
import Enzyme, { shallow, mount, render } from 'enzyme';
import toJson from 'enzyme-to-json';
import sinon from 'sinon'
import PublisherPage from "../publisherPage"





//Dummy Data



//Mocks
const sandbox = sinon.sandbox.create()
global.fetch = sandbox.stub().callsFake(() => Promise.resolve({json: () => participationSummary}));
const didMount = sandbox.spy(PublisherPage.prototype, 'componentDidMount')
const setState = sandbox.spy(PublisherPage.prototype, 'setState')




//Render and begin tests
const shallowComponent = shallow(<PublisherPage match={{params: {publisherName: 'publisher name'}}}/>)




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