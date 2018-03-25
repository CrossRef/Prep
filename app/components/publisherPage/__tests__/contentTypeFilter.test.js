import React from 'react';
import Enzyme, { shallow, mount, render } from 'enzyme';
import toJson from 'enzyme-to-json';
import sinon from 'sinon'
import ContentTypeFilter from "../components/checksFilter"






//Dummy Data
const filters = ['journal-articles', 'books', 'book-chapters', 'conference-papers', 'reports']
let currentFilter = 'journal-articles'

//Mocks
const sandbox = sinon.sandbox.create()
const setState = sandbox.spy(ContentTypeFilter.prototype, 'setState')
const setFilter = sandbox.stub()




//Render and begin tests
const shallowComponent = shallow(<ContentTypeFilter filters={filters} currentFilter={currentFilter} setFilter={setFilter} />)




test('shallow snapshot', () => {
  expect(toJson(shallowComponent)).toMatchSnapshot()
})


describe('open filter menu', () => {
  test('menu should render', () => {
    shallowComponent.find('.contentTypeFilter').prop('onClick')()
    expect(setState.callCount).toBe(1)
    shallowComponent.update()
    expect(shallowComponent.state('menuOpen')).toBe(true)
    const filterList = shallowComponent.find('.filterList')
    expect(filterList.children().length).toBe(filters.length)
    expect(toJson(shallowComponent)).toMatchSnapshot()
  })
  
  test('current filter should be checked', () => {
    expect(shallowComponent.find(`#${currentFilter}_checkmark`).length).toBe(1)
  })
})


describe('select a filter', () => {
  let newFilter = filters[1]

  test('filterMenu should close and setFilter called with new filter', () => {
    sandbox.resetHistory()
    shallowComponent.find(`#${newFilter}_button`).prop('onClick')()
    shallowComponent.find('.contentTypeFilter').prop('onClick')()
    expect(setState.callCount).toBe(1)
    expect(setFilter.callCount).toBe(1)
    expect(setFilter.calledWith(newFilter))
    shallowComponent.setProps({currentFilter: newFilter})
    shallowComponent.update()
    expect(shallowComponent.state('menuOpen')).toBe(false)
    const filterList = shallowComponent.find('.filterList')
    expect(filterList.children().length).toBe(0)
  })


  test('new filter has checkmark when menu opened', () => {
    shallowComponent.find('.contentTypeFilter').prop('onClick')()
    shallowComponent.update()
    expect(shallowComponent.find(`#${newFilter}_checkmark`).length).toBe(1)
  })
})