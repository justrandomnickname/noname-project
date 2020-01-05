import styled from 'styled-components'

export const RegularText = styled('span')<{ hoverable?: boolean }>`
  color: ${props => props.theme.standardTextColor} !important;
  font-size: ${props => props.theme.fontSizeStandard} !important;
  line-height: 1.25em;
  font-family: 'Open Sans', regular;
  transition: 0.2s all;
  &:hover {
    cursor: ${props => (props.hoverable ? 'pointer' : null)}
    color: ${props => (props.hoverable ? props.theme.secondaryColor : props.theme.standardTextColor)} !important;
  }
`

export const GrandText = styled.span`
  font-size: 15pt;
  font-family: 'Kurale', serif;
  font-weight: 500;
  margin: 0;
  padding: 0;
`
