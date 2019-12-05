import React from 'react'
import { Wrapper } from '@Game/views/Wrapper'

export interface IProps {
  children: React.ReactNode
}

const GameScreen: React.FC<IProps> = (props: IProps) => {
  return <Wrapper>{props.children}</Wrapper>
}

export default GameScreen
