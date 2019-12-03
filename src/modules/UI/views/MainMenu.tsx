import React from 'react'
import MainLink from '@UI/components/MainLink'
import UI from '@Core/UI'
import styled from 'styled-components'

const Wrapper = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  display: grid;
`

const MenuWrapper = styled.div`
  text-align: center;
  place-self: center;
  margin-top: -100px;
`

const MainMenu: React.FC = () => {
  return (
    <Wrapper>
      <MenuWrapper>
        <UI.BigTitle>Main Menu</UI.BigTitle>
        <MainLink to="/map" text="New Game" />
        <MainLink to="/test" text="Load Game" />
        <MainLink to="/test" text="Settings" />
        <MainLink to="/test" text="Exit" />
      </MenuWrapper>
    </Wrapper>
  )
}

export default MainMenu
