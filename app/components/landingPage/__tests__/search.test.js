import React from 'react';
import Enzyme, { shallow, mount, render } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
Enzyme.configure({ adapter: new Adapter() });
import toJson from 'enzyme-to-json';
import sinon from 'sinon'

import Search from '../components/search'


let savedSearches = JSON.stringify([{name: 'saved search 1', id: 1}, {name: 'saved search 2', id: 2}])
const parsedSavedSearches = JSON.parse(savedSearches)


const localStorageMock = {
  getItem: sinon.stub().callsFake(() => savedSearches),
  setItem: sinon.stub(),
  clear: sinon.stub()
};
global.localStorage = localStorageMock;


const members = {
  'status': 'ok',
  'message-type': "members",
  "message-version": "1.0.0",
  "resultCount": 5871,
  "message": [
    {'name': 'caltech', 'id': 1},
    {'name': 'cambridge Core', 'id': 2},
    {'name': 'crossref University Press', 'id': 3},
    {'name': 'carnegie Mellon University', 'id': 4},
    {'name': 'cambridge University Press', 'id': 5},
    {'name': 'cornell University', 'id': 6}
  ]
}
global.fetch = sinon.stub().callsFake(() => Promise.resolve(members));


const history = {
  push: sinon.stub()
}
const didMount = sinon.spy(Search.prototype, 'componentDidMount')
const setState = sinon.spy(Search.prototype, 'setState')


const mountComponent = mount(<Search history={history}/>)






test('mount snapshot', () => {
  expect(didMount.callCount).toBe(1)
  expect(toJson(mountComponent)).toMatchSnapshot()
})





describe('componentDidMount', () => {

  test('should get savedSearches from localstorage', () => {
    expect(localStorageMock.getItem.callCount).toBe(1)
    expect(setState.args[0][0]).toEqual({savedSearches: parsedSavedSearches})
    expect(mountComponent.state('savedSearches')).toEqual(parsedSavedSearches)
  })

  test('should get members from api', () => {
    expect(global.fetch.callCount).toBe(1)
    expect(setState.args[1][0]).toEqual({data: members.message})
    expect(mountComponent.state('data')).toEqual(members.message)
  })
})





describe('focus input', () => {

  test('onFocus event should set focused state to true', () => {
    setState.resetHistory()

    mountComponent.find('input').prop('onFocus')()
    expect(setState.callCount).toBe(1)
    expect(mountComponent.state('focused')).toBe(true)
    mountComponent.update()
  })


  test('should show saved searches', () => {
    expect(mountComponent.state('savedSearches')).toEqual(parsedSavedSearches)

    const searchResults = mountComponent.find('.searchInputHolder').children('div')
    expect(searchResults.length).toBe(1)
    expect(searchResults.prop('style').display).toBe('initial')
    expect(mountComponent.find('Autocomplete').prop('items')).toEqual(parsedSavedSearches)
    expect(toJson(searchResults)).toMatchSnapshot()
  })


  test('onBlur event should make search results disappear', () => {
    setState.resetHistory()
    mountComponent.find('input').prop('onBlur')()
    expect(setState.callCount).toBe(1)
    expect(mountComponent.state('focused')).toBe(false)
    mountComponent.update()
    expect(mountComponent.find('.searchInputHolder').children('div').length).toBe(0)
  })


  test('if no savedSearches, results div should not be visible', () => {
    mountComponent.setState({savedSearches: undefined})
    mountComponent.update()

    mountComponent.find('input').prop('onFocus')()
    mountComponent.update()

    const searchResults = mountComponent.find('.searchInputHolder').children('div')
    expect(searchResults.length).toBe(1)
    expect(searchResults.prop('style').display).toBe('none')
  })
})





// describe('typing into search', () => {
//
//   test('...', () => {
//     mountComponent.find('input').prop('onChange')
//   })
// })
