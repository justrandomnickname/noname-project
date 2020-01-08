import styled, { keyframes } from 'styled-components'

export const MessageAppear = keyframes`
  from {
    top: -10px
  }
  to {
    top: 0
  }
`

export const HideoutWrapper = styled.div`
  width: 100%;
  height: 100%;
  background: ${props => props.theme.primaryColor};
  display: grid;
  grid-template-columns: 20% auto 20% 20%;
  grid-template-rows: 35px 66px 20% 30% auto;
`

export const HideoutMenu = styled.div`
  width: 100%;
  border-bottom: ${props => '10px solid ' + props.theme.primarySaturatedColor};
  display: flex;
  grid-row-start: 2;
  grid-row-end: 3;
  grid-column-start: 1;
  grid-column-end: 5;
`

export const HideoutMenuElement = styled.div`
  padding: 0.5em;
`

export const MessagesElement = styled.div`
  width: 100%;
  position: relative;
  animation: ${MessageAppear} 0.2s linear;
`

export const DialogContainer = styled.div`
  position: relative;
  min-height: 55px;
  padding: 1em;
  margin-bottom: 0.25em;
  margin-top: 0.25em;
  display: flex;
  align-self: flex-start;
  flex-wrap: nowrap;
  align-items: flex-start;
  img {
    height: 3em;
    width: 3em;
  }
`

export const DialogAction = styled.div`
  width: 99%;
  color: ${props => props.theme.primaryColor};
  background: ${props => props.theme.secondaryColor};
  padding: 0.25em 0.25em 0.25em 0.75em;
  margin-left: 1em;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  border-bottom-right-radius: 10px;
  position: relative;
  &:before {
    content: '';
    position: absolute;
    left: 0;
    top: 50%;
    width: 0;
    height: 0;
    border: 20px solid transparent;
    border-right-color: ${props => props.theme.secondaryColor};
    border-left: 0;
    border-bottom: 0;
    margin-top: -5px;
    margin-left: -10px;
  }
`

export const PawnListElement = styled.div`
  width: 100%;
`

export const PawnListWrapper = styled.div`
  grid-column-start: 4;
  grid-column-end: 5;
  grid-row-start: 3;
  grid-row-end: 6;
  padding: ${props => props.theme.defaultBlockPadding};
  border-left: ${props => '10px solid ' + props.theme.primarySaturatedColor};
  display: flex;
  flex-wrap: wrap;
  flex-direction: column;
  img {
    height: 0.9em;
    width: 0.9em;
    position: relative;
    top: 2px;
  }
`

export const ActionListWrapper = styled.div`
  padding: ${props => props.theme.defaultBlockPadding};
  display: flex;
  align-self: flex-start;
  flex-wrap: wrap;
  align-items: flex-start;
`

export const ActionListContainer = styled.div`
  grid-column-start: 2;
  grid-column-end: 4;
  grid-row-start: 5;
  grid-row-end: 6;
  place-self: stretch;
  background: #1b1b18;
`

export const ActionListElement = styled('div')<{ color: string; isActive: boolean }>`
  margin: 0.5em 0.5em 0em 0;
  border: ${props => '2px solid ' + props.color};
  background: ${props => props.color};
  color: ${props => props.theme.primaryColor + '  !important'};
  opacity: ${props => (props.isActive ? '1' : '0.5')}
  border-radius: 10px;
  padding: 0.5em;
  display: flex;
  span {
    line-height: 30px;
  }
  img {
    height: 2em;
    width: 2em;
  }
`

export const MessageListWrapper = styled.div`
  grid-column-start: 2;
  grid-column-end: 4;
  grid-row-start: 3;
  grid-row-end: 5;
  padding: ${props => props.theme.defaultBlockPadding};
  overflow-y: scroll;
  ::-webkit-scrollbar {
    width: 7px;
  }
`
export const LivestockContainer = styled.div`
  width: 95%;
  padding: 0.5em;
  display: flex;
  grid-column-start: 1;
  grid-column-end: 4;
  grid-row-start: 1;
  grid-row-end: 3;
`
export const LivestockElement = styled.div`
  padding: 0em 0.25em;
`
