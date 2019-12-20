import styled from 'styled-components'

export const Button = styled.button`
  margin: 0px auto;
  padding: 0.5em;
  color: ${props => props.theme.primaryColor}
  font-family: 'Kurale', serif;
  border: 0px solid black;
  background: ${props => props.theme.secondaryColor};
  box-shadow: 0px 0px 35px 1px rgba(249, 211, 66, 0.45);
  font-size: 1.5em;
  outline: 0;
  border-radius: 2px;
  line-height: 30px;
  text-transform: uppercase;
`
