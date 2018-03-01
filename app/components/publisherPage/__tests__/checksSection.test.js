import React from 'react';
import Enzyme, { shallow, mount, render } from 'enzyme';
import toJson from 'enzyme-to-json';
import sinon from 'sinon'
import ChecksSection from "../components/checksSection"





//Dummy Data



//Mocks
const sandbox = sinon.sandbox.create()
const setState = sandbox.spy(ContentTypeFilter.prototype, 'setState')




//Render and begin tests
const shallowComponent = shallow(<ChecksSection />)



test('shallow snapshot', () => {

})


describe('filter is set to new value', () => {
  test('new checks are rendered', () => {

  })

  test('titleBar filter type text updated', () => {

  })
})
