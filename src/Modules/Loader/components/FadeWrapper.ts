import styled, { keyframes } from 'styled-components'
const fade = keyframes`
0% {
  top: -18px;
  opacity: 0;
}
75% {
  opacity: 1
}
100% {
  top: 0;
}
`

export const FadeWrapper = styled.div`
  position: relative;
  top: 0;
  animation: ${fade} 0.5s ease-out;
  text-align: center;
`
