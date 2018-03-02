import React from 'react';
import Enzyme, { shallow, mount, render } from 'enzyme';
import toJson from 'enzyme-to-json';
import sinon from 'sinon'

import CheckBox from '../components/checkBox'
import * as helpers from  '../../../utilities/helpers'



jest.useFakeTimers();


//Dummy Data
const item = {
  name: 'Abstracts',
  info: 'tooltip text',
  percentage: 39
}



//Mocks
const sandbox = sinon.sandbox.create()
const didMount = sandbox.spy(CheckBox.prototype, 'componentDidMount')
const setState = sandbox.spy(CheckBox.prototype, 'setState')
const updatePosition = sandbox.spy(CheckBox.prototype, 'updateTooltipPosition')
const debounce = sandbox.spy(helpers, 'debounce')

let openTooltip = undefined
const setOpenTooltip = sandbox.stub().callsFake((name) => openTooltip = name)


window.matchMedia = sandbox.stub().callsFake(() => ({matches: window.innerWidth <= 639}))
sandbox.spy(window, 'addEventListener')
sandbox.spy(window, 'removeEventListener')


let xPosition = 200
sandbox.stub(Element.prototype, 'getBoundingClientRect').callsFake(() => ({x: xPosition}))



//Render and test
const mountComponent = mount(<CheckBox item={item} openTooltip={openTooltip} setOpenTooltip={setOpenTooltip}/>)



test('mount snapshot', () => {
  expect(didMount.callCount).toBe(1)
  expect(toJson(mountComponent)).toMatchSnapshot()
})


describe('componentDidMount', () => {
  test('should update tooltip positioning and add event listener', () => {
    expect(updatePosition.callCount).toBe(1)
    expect(window.addEventListener.calledWith('resize', mountComponent.instance().debouncedUpdate)).toBe(true)
  })


})


describe('resize debounce', () => {
  test('multiple resize events should run updatePosition once after delay', () => {
    sandbox.resetHistory()
    window.resizeTo(1000)
    window.resizeTo(1000)
    expect(debounce.callCount).toBe(2)
    expect(setTimeout).toHaveBeenCalledTimes(2)
    expect(clearTimeout).toHaveBeenCalledTimes(1)
    expect(updatePosition.callCount).toBe(0)
    jest.runAllTimers()
    expect(updatePosition.callCount).toBe(1)
  })
})


describe('non mobile', () => {
  test('if component on right side, tooltip on left', () => {
    xPosition = 1000
    mountComponent.instance().updateTooltipPosition()
    mountComponent.update()
    expect(mountComponent.state('tooltipRight')).toBe(false)
    expect(mountComponent.find('.mobileTooltip').length).toBe(0)
  })

  test('if component on left side, tooltip on right', () => {
    xPosition = 600
    mountComponent.instance().updateTooltipPosition()
    mountComponent.update()
    expect(mountComponent.state('tooltipRight')).toBe(true)
    expect(mountComponent.find('.mobileTooltip').length).toBe(0)
  })

  test('resizing window small enough switches tooltip to left', () => {
    sandbox.resetHistory()
    xPosition = 600
    window.resizeTo(800)
    jest.runAllTimers()
    expect(updatePosition.callCount).toBe(1)
    mountComponent.update()
    expect(mountComponent.state('tooltipRight')).toBe(false)
  })

  test('resizing window big enough, switches tooltip to right', () => {
    sandbox.resetHistory()
    xPosition = 600
    window.resizeTo(1000)
    jest.runAllTimers()
    expect(updatePosition.callCount).toBe(1)
    mountComponent.update()
    expect(mountComponent.state('tooltipRight')).toBe(true)
  })

  test('clicking on tooltip icon should do nothing', () => {
    expect(mountComponent.find('.hoverIcon').prop('onClick')).toBe(null)
  })

  test('changing openTooltip prop should not show tooltip', () => {
    mountComponent.setProps({openTooltip: item.name})
    mountComponent.update()
    expect(mountComponent.find('.mobileTooltipOpen').length).toBe(0)
    expect(mountComponent.find('.mobileTooltip').length).toBe(0)
    mountComponent.setProps({openTooltip: undefined})
    mountComponent.update()
  })
})


describe('on mobile', () => {
  test('tooltip has special mobile styling', () => {
    xPosition = 20
    window.innerWidth = 320
    mountComponent.unmount()
    mountComponent.mount()
    expect(mountComponent.find('.mobileTooltip').length).toBe(1)
  })

  test('clicking icon should fire "setOpenTooltip" with name param', () => {
    sandbox.resetHistory()
    mountComponent.find('.hoverIcon').prop('onClick')()
    expect(setOpenTooltip.calledWith(item.name)).toBe(true)
  })

  test('setting tooltipOpen prop to item name should give class mobileTooltipOpen', () => {
    expect(mountComponent.find('.mobileTooltipOpen').length).toBe(0)
    mountComponent.setProps({openTooltip: item.name})
    mountComponent.update()
    expect(mountComponent.find('.mobileTooltipOpen').length).toBe(1)
  })

  test('clicking close icon should fire "setOpenTooltip" with undefined param and remove mobileTooltipOpen class', () => {
    mountComponent.find('.tooltipCloseButton').prop('onClick')()
    expect(setOpenTooltip.calledWith(undefined)).toBe(true)
    mountComponent.setProps({openTooltip: undefined})
    mountComponent.update()
    expect(mountComponent.find('.mobileTooltipOpen').length).toBe(0)
  })
})


describe('componentWillUnmount', () => {
  test('should remove event listener', () => {
    sandbox.resetHistory()
    const debouncedUpdate = mountComponent.instance().debouncedUpdate
    mountComponent.unmount()
    expect(window.removeEventListener.calledWith('resize', debouncedUpdate)).toBe(true)

  })
})