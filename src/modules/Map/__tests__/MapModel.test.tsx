import React from 'react'
import Adapter from 'enzyme-adapter-react-16'
import Enzyme from 'enzyme'
import { shallow } from 'enzyme'
import 'jest-styled-components'
import MainMap from '@Map/views/MainMap'

Enzyme.configure({ adapter: new Adapter() })

describe('(MODEL/MAP)', () => {
  it('(MainMap) should render empty', () => {
    const wrapper = shallow(<MainMap />)
    expect(wrapper).toMatchSnapshot()
    wrapper.debug()
    expect(wrapper.text()).toBe('')
  })
})
