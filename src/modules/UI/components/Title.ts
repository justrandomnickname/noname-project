import styled from 'styled-components'

export const Title = styled.h1`
  margin: 0;
  padding: 0.3em;
  color: ${props => props.theme.secondaryColor};
  font-size: ${props => props.theme.fontSizeTitle};
  font-family: 'Kurale', serif;
  letter-spacing: ${props => props.theme.letterSpacingTitle};
`

export const BigTitle = styled.h2`
  margin: 0;
  padding: 0.7em;
  color: ${props => props.theme.standardTextColor};
  font-size: ${props => props.theme.fontSizeBigTitle};
  font-family: 'Kurale', serif;
`
