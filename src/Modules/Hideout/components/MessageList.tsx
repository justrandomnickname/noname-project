import React from 'react'
import UI from '@UI/index'
import { MessageListWrapper } from './styled/index'
import { Message } from '@Modules/Location/Messages/Message'

interface IProps {
  messages: Message.IMessage[]
}

const MessageList: React.FC<IProps> = (props: IProps) => {
  return (
    <MessageListWrapper>
      <UI.Title bordered>
        <span>Hideout</span>
      </UI.Title>
      {props.messages.map(message => {
        return message.tsx
      })}
    </MessageListWrapper>
  )
}

export default MessageList
