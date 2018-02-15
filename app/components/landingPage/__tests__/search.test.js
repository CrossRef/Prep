import React from 'react';
import Enzyme, { shallow, mount, render } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
Enzyme.configure({ adapter: new Adapter() });
import toJson from 'enzyme-to-json';
import sinon from 'sinon'

import deployConfig from '../../../../deployConfig'
import Search from '../components/search'


//Dummy Data
const parsedSavedSearches = [
  {name: 'saved search 21', id: 21},
  {name: 'saved search 22', id: 22},
  {name: 'saved search 23', id: 23},
  {name: 'saved search 24', id: 24},
  {name: 'saved search 25', id: 25},
]

let savedSearches = JSON.stringify(parsedSavedSearches)

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


//Mocks
const sandbox = sinon.sandbox.create()

const localStorageMock = {
  getItem: sandbox.stub().callsFake(() => savedSearches),
  setItem: sandbox.stub(),
  clear: sandbox.stub()
};
global.localStorage = localStorageMock;

global.fetch = sandbox.stub().callsFake(() => Promise.resolve({json: () => members}));

const history = {
  push: sandbox.stub()
}

const didMount = sandbox.spy(Search.prototype, 'componentDidMount')
const setState = sandbox.spy(Search.prototype, 'setState')





//Render and begin tests
const mountComponent = mount(<Search history={history}/>)




test('mount snapshot', () => {
  expect(didMount.callCount).toBe(1)
  expect(toJson(mountComponent)).toMatchSnapshot()
})




describe('componentDidMount', () => {

  test('should get savedSearches from localstorage', () => {
    expect(localStorageMock.getItem.callCount).toBe(1)
    expect(localStorageMock.getItem.args[0][0]).toBe('savedSearches')
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
    sandbox.resetHistory()

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
    sandbox.resetHistory()
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





describe('searching', () => {
  const filteredData = [
    {'name': 'cambridge Core', 'id': 2},
    {'name': 'cambridge University Press', 'id': 5}
  ]
  const selection = filteredData[0]


  test('items array should be filtered by typed input, not case sensitive', () => {
    sandbox.resetHistory()
    mountComponent.find('Autocomplete').prop('onChange')(null, 'CAm')
    expect(setState.callCount).toBe(1)
    expect(mountComponent.state('searchingFor')).toBe('CAm')
    mountComponent.update()

    const searchResults = mountComponent.find('.searchInputHolder').children('div')
    expect(searchResults.length).toBe(1)
    expect(searchResults.prop('style').display).toBe('initial')

    expect(mountComponent.find('Autocomplete').prop('items')).toEqual(filteredData)
    expect(toJson(searchResults)).toMatchSnapshot()
  })


  test('if no search results, should not show results div, even if there are saved searches', () => {
    mountComponent.setState({savedSearches: parsedSavedSearches})
    mountComponent.update()

    mountComponent.find('Autocomplete').prop('onChange')(null, 'xxxxxxx')
    mountComponent.update()

    const searchResults = mountComponent.find('.searchInputHolder').children('div')
    expect(searchResults.length).toBe(1)
    expect(searchResults.prop('style').display).toBe('none')
  })


  test('first selection should instantiate localStorage for savedSearches', () => {
    sandbox.resetHistory()
    savedSearches = null
    mountComponent.find('Autocomplete').prop('onSelect')(selection.name, selection)
    expect(localStorageMock.getItem.callCount).toBe(1)
    expect(localStorageMock.setItem.callCount).toBe(1)
    expect(localStorageMock.setItem.args[0]).toEqual(['savedSearches', JSON.stringify([selection])])
  })


  test('if search selection already saved, should move selection to front of list', () => {
    sandbox.resetHistory()
    savedSearches = JSON.stringify(parsedSavedSearches)
    const repeatSelection = parsedSavedSearches[3]

    mountComponent.find('Autocomplete').prop('onSelect')(repeatSelection.name, repeatSelection)

    const newSavedSearches = [...parsedSavedSearches]
    newSavedSearches.splice(3, 1)
    newSavedSearches.unshift(repeatSelection)

    expect(localStorageMock.setItem.args[0]).toEqual(['savedSearches', JSON.stringify(newSavedSearches)])
  })


  test('making a selection should save to localStorage and navigate to publisher page', () => {
    sandbox.resetHistory()
    mountComponent.find('Autocomplete').prop('onSelect')(selection.name, selection)

    const newSavedSearches = [...parsedSavedSearches]
    newSavedSearches.unshift(selection)
    expect(localStorageMock.setItem.args[0]).toEqual(['savedSearches', JSON.stringify(newSavedSearches)])

    expect(history.push.callCount).toBe(1)
    expect(history.push.args[0][0]).toBe(`${deployConfig.baseUrl}${encodeURIComponent('cambridge Core')}/2`)
  })


  test('should only keep last 6 savedSearches', () => {
    sandbox.resetHistory()
    const savedSearchesArray= [...parsedSavedSearches, {name: 'saved search 26', id: 26}]
    savedSearches = JSON.stringify(savedSearchesArray)

    mountComponent.find('Autocomplete').prop('onSelect')(selection.name, selection)

    savedSearchesArray.pop()
    savedSearchesArray.unshift(selection)

    expect(localStorageMock.setItem.args[0]).toEqual(['savedSearches', JSON.stringify(savedSearchesArray)])
  })
})
