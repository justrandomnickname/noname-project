import styled from 'styled-components'
import { Link } from 'react-router-dom'
import React from 'react'
import { Props } from '@UI/interfaces/MainLink'
import UI from '@Core/UI'

const StyledLinkWrapper = styled.div`
  font-size: 1.3em;
`
// const LinkText = styled.span`
//   color: ${props => props.theme.secondaryColor};
// `

const MainLink: React.FC<Props> = (props: Props) => (
  <StyledLinkWrapper>
    <Link to={props.to}>
      <UI.Title>{props.text}</UI.Title>
    </Link>
  </StyledLinkWrapper>
)

export default MainLink
