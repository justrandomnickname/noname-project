import React from 'react'
import { Wrapper } from '@Game/views/Wrapper'
// import UI from '@Core/UI'
import { Props } from './interfaces/GameScreen'

const GameScreen: React.FC<Props> = (props: Props) => {
  return <Wrapper>{props.children}</Wrapper>
}

export default GameScreen
