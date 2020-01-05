import styled from 'styled-components'

export const Title = styled('h1')<{ bordered?: boolean }>`
  margin: 0em 0em 0.5em 0em
  padding: 0em 0em 0.25em 0em
  color: ${props => props.theme.secondaryColor};
  font-size: ${props => props.theme.fontSizeTitle};
  font-family: 'Kurale', serif;
  letter-spacing: ${props => props.theme.letterSpacingTitle};
  span {
    border-bottom: ${props => (props.bordered ? '2px ' + 'solid ' + props.theme.secondaryColor : null)};
  }
`

export const BigTitle = styled.h2`
  margin: 0;
  padding: 0.7em;
  color: ${props => props.theme.standardTextColor};
  font-size: ${props => props.theme.fontSizeBigTitle};
  font-family: 'Kurale', serif;
`
