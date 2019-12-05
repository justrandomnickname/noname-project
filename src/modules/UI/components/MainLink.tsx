import styled from 'styled-components'
import { Link } from 'react-router-dom'
import React from 'react'
import UI from '@Core/UI'

const StyledLinkWrapper = styled.div`
  font-size: 1.3em;
`
// const LinkText = styled.span`
//   color: ${props => props.theme.secondaryColor};
// `

export interface IProps {
  to: string
  text: string
}

const MainLink: React.FC<IProps> = (props: IProps) => (
  <StyledLinkWrapper>
    <Link to={props.to}>
      <UI.Title>{props.text}</UI.Title>
    </Link>
  </StyledLinkWrapper>
)

export default MainLink
