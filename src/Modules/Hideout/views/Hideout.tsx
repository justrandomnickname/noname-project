import React, { useState, useLayoutEffect } from 'react'
import styled, { keyframes } from 'styled-components'
import UI from '@UI/index'
import { Location } from '@Modules/Location/Location'
import { ActionsController } from '@Controllers/ActionsController'
import { Action } from '@Modules/Location/Action'

const MessageAppear = keyframes`
  from {
    top: -10px
  }
  to {
    top: 0
  }
`

const HideoutWrapper = styled.div`
  width: 100%;
  height: 100%;
  background: ${props => props.theme.primaryColor};
  display: grid;
  grid-template-columns: 20% auto 20% 20%;
  grid-template-rows: 35px 66px 20% 30% auto;
`

const LivestockContainer = styled.div`
  width: 95%;
  padding: 0.5em;
  display: flex;
  grid-column-start: 1;
  grid-column-end: 4;
  grid-row-start: 1;
  grid-row-end: 3;
`
const LivestockElement = styled.div`
  padding: 0em 0.25em;
`

const HideoutMenu = styled.div`
  width: 100%;
  border-bottom: ${props => '10px solid ' + props.theme.primarySaturatedColor};
  display: flex;
  grid-row-start: 2;
  grid-row-end: 3;
  grid-column-start: 1;
  grid-column-end: 5;
`

const HideoutMenuElement = styled.div`
  padding: 0.5em;
`

const PresentInAreaWrapper = styled.div`
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

const PresentInAreaElement = styled.div`
  width: 100%;
`

const LocationJumperWrapper = styled.div`
  border-right: ${props => '10px solid ' + props.theme.primarySaturatedColor};
  grid-column-start: 1;
  grid-column-end: 2;
  grid-row-start: 3;
  grid-row-end: 6;
  padding: ${props => props.theme.defaultBlockPadding};
`

const DescriptionWrapper = styled.div`
  grid-column-start: 2;
  grid-column-end: 4;
  grid-row-start: 3;
  grid-row-end: 5;
  padding: ${props => props.theme.defaultBlockPadding};
  overflow-y: scroll;
  ::-webkit-scrollbar {
    width: 7px;
  }

  ::-webkit-scrollbar-track {
    box-shadow: inset 0 0 5px grey;
    border-radius: 10px;
  }

  ::-webkit-scrollbar-thumb {
    background: ${props => props.theme.secondaryColor};
    border-radius: 10px;
  }
`

export const DescriptionElement = styled.div`
  width: 100%;
  position: relative;
  animation: ${MessageAppear} 0.2s linear;
`

const ActionsWrapper = styled.div`
  padding: ${props => props.theme.defaultBlockPadding};
  display: flex;
  align-self: flex-start;
  flex-wrap: wrap;
  align-items: flex-start;
`

const ActionsContainer = styled.div`
  grid-column-start: 2;
  grid-column-end: 4;
  grid-row-start: 5;
  grid-row-end: 6;
  place-self: stretch;
  background: #1b1b18;
`

const ActionsElement = styled('div')<{ color: string }>`
  margin: 0.5em 0.5em 0em 0;
  border: ${props => '2px solid ' + props.color};
  background: ${props => props.color};
  color: ${props => props.theme.primaryColor + '  !important'};
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

const initialMessage = [
  'At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus. Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae. Itaque earum rerum hic tenetur a sapiente delectus, ut aut reiciendis voluptatibus maiores alias consequatur aut perferendis doloribus asperiores repellat.',
]

const Hideout: React.FC<{}> = () => {
  const [messages, addMessage] = useState<JSX.Element[]>([])
  const location: Location = new Location(addMessage)
  const [actions, setActions] = useState<Action.IAction[]>([])
  const actionsController = new ActionsController(setActions)

  useLayoutEffect(() => {
    location.CreateDescriptionMessage(initialMessage[0])
    actionsController.injectActions('hideout_basic')
  }, [])
  return (
    <HideoutWrapper>
      <LivestockContainer>
        <LivestockElement>
          <UI.RegularText>Gold: 0</UI.RegularText>
        </LivestockElement>
        <LivestockElement>
          <UI.RegularText>Silver: 0</UI.RegularText>
        </LivestockElement>
        <LivestockElement>
          <UI.RegularText>Gems: 0</UI.RegularText>
        </LivestockElement>
        <LivestockElement>
          <UI.RegularText>Food: 0</UI.RegularText>
        </LivestockElement>
        <LivestockElement>
          <UI.RegularText>Trade Goods: 0</UI.RegularText>
        </LivestockElement>
        <LivestockElement>
          <UI.RegularText>Resources: 0</UI.RegularText>
        </LivestockElement>
        <LivestockElement>
          <UI.RegularText>Weapons and armour: 0</UI.RegularText>
        </LivestockElement>
        <LivestockElement>
          <UI.RegularText>Lore: 0</UI.RegularText>
        </LivestockElement>
        <LivestockElement>
          <UI.RegularText>Crystals: 0</UI.RegularText>
        </LivestockElement>
      </LivestockContainer>
      <HideoutMenu>
        <HideoutMenuElement>
          <UI.Title>Hideout</UI.Title>
        </HideoutMenuElement>
        <HideoutMenuElement>
          <UI.Title>Barracks</UI.Title>
        </HideoutMenuElement>
        <HideoutMenuElement>
          <UI.Title>Hall</UI.Title>
        </HideoutMenuElement>
      </HideoutMenu>
      <LocationJumperWrapper>
        <UI.GrandText>Location 1</UI.GrandText>
      </LocationJumperWrapper>
      <DescriptionWrapper>
        <UI.Title bordered>
          <span>Hideout</span>
        </UI.Title>
        {messages}
      </DescriptionWrapper>
      <ActionsContainer>
        <ActionsWrapper>
          {actions.map((action, index) => (
            <ActionsElement color={action._color} key={index}>
              <img src={action._pic} />
              <UI.GrandText>{action._text}</UI.GrandText>
            </ActionsElement>
          ))}
        </ActionsWrapper>
      </ActionsContainer>
      <PresentInAreaWrapper>
        <UI.Title bordered>
          <span>Present in area</span>
        </UI.Title>
        <PresentInAreaElement>
          <UI.RegularText hoverable>Player</UI.RegularText>
          <img src="inspection.svg" />
        </PresentInAreaElement>
        <PresentInAreaElement onClick={() => location.CreateDialogMessage('Hello. What can i do for you?', 'elf.svg')}>
          <UI.RegularText hoverable>Elizabeth Cornwall</UI.RegularText>
          <img src="inspection.svg" />
        </PresentInAreaElement>
      </PresentInAreaWrapper>
    </HideoutWrapper>
  )
}

export default Hideout
