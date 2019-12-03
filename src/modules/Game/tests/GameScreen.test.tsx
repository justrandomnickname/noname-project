import React from 'react'
import renderer from 'react-test-renderer'
import 'jest-styled-components'
import GameScreen from '@Game/GameScreen'
import UI from '@Core/UI'

it('(GameScreen) renders correctly', () => {
  const wrapper = renderer
    .create(
      <GameScreen>
        <UI.Button />
      </GameScreen>,
    )
    .toJSON()
  expect(wrapper).toMatchSnapshot()
})
