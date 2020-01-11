import React from 'react'
import { Wrapper } from '@Game/views/Wrapper'
import Menu from './views/Menu'

export interface IProps {
  children: React.ReactNode
}

const GameScreen: React.FC<IProps> = (props: IProps) => {
  return (
    <Wrapper>
      <Menu />
      {props.children}
    </Wrapper>
  )
}

export default GameScreen
