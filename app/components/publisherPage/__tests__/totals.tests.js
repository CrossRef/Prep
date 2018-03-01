import React from 'react';
import Enzyme, { shallow, mount, render } from 'enzyme';
import toJson from 'enzyme-to-json';
import sinon from 'sinon'

import Totals from '../components/totals'




//Dummy Data
const totals = {
  "journal-articles":12345,
  "books":1234,
  "conference-papers":123,
  "reports":123,
  "datasets":0,
  "dissertations":0,
  "posted-content":0,
  "standards":0
}


//Render and begin tests
const shallowComponent = shallow(<Totals totals={totals}/>)


test('shallow snapshot', () => {
  expect(toJson(shallowComponent)).toMatchSnapshot()
})