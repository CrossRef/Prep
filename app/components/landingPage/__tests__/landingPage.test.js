import React from 'react';
import Enzyme, { shallow, mount, render } from 'enzyme';
import toJson from 'enzyme-to-json';
import sinon from 'sinon'

import LandingPage from '../landingPage'




const shallowComponent = shallow(<LandingPage/>)


test('shallow snapshot', () => {
  expect(toJson(shallowComponent)).toMatchSnapshot()
})