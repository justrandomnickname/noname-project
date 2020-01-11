import React, { useState, useLayoutEffect } from 'react'
import styled from 'styled-components'
import UI from '@UI/index'

import { ActionsController } from '@Controllers/ActionsController'
import { PawnsController } from '@Controllers/PawnsController'
import { MessagesController } from '@Controllers/MessagesController'
import { LivestockController } from '@Controllers/LivestockController'

import PawnList from '../components/PawnList'
import ActionList from '../components/ActionList'
import MessageList from '../components/MessageList'
import LivestockComponent from '../components/Livestock'

import { HideoutWrapper, HideoutMenu, HideoutMenuElement } from '../components/styled/index'

import { Livestock } from '@Modules/Location/Livestock'
import { Message } from '@Modules/Location/Messages/Message'
import { Pawn } from '@Modules/Pawn/Pawn'
import { Action } from '@Modules/Location/Action'

const LocationJumperWrapper = styled.div`
  border-right: ${props => '10px solid ' + props.theme.primarySaturatedColor};
  grid-column-start: 1;
  grid-column-end: 2;
  grid-row-start: 3;
  grid-row-end: 6;
  padding: ${props => props.theme.defaultBlockPadding};
`

const Hideout: React.FC<{}> = () => {
  const [messages, setMessages] = useState<Message.IMessage[]>([])
  const [actions, setActions] = useState<Action.IAction[]>([])
  const [pawns, setPawns] = useState<Pawn.IPawn[]>([])
  const [livestock, setLivestock] = useState<Livestock.IResource[]>([])
  const controllers = {
    actions: new ActionsController(setActions),
    messages: new MessagesController(setMessages),
    pawns: new PawnsController(setPawns),
    livestock: new LivestockController(setLivestock),
  }

  useLayoutEffect(() => {
    Object.values(controllers).forEach(controller => controller.Mount())
    controllers.pawns.CreatePawns()
    controllers.actions.InjectActions('hideout_basic')
    controllers.messages.CreateDescription('hideout_description')
    return () => {
      Object.values(controllers).forEach(controller => {
        controller.Unmount()
      })
    }
  }, [])
  return (
    <HideoutWrapper>
      <LivestockComponent resources={livestock} />
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
      <MessageList messages={messages} />
      <ActionList actions={actions} />
      <PawnList playerInAction pawns={pawns} actionController={controllers.actions} />
    </HideoutWrapper>
  )
}

export default Hideout
