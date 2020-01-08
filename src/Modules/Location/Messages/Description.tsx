import React from 'react'
import { Message } from './Message'
import { MessagesElement } from '@Modules/Hideout/components/styled'
import UI from '@UI/index'

export class Description extends Message implements Description.IDescription {
  public payload: Description.IPayload
  protected _tsx: JSX.Element
  constructor(payload: { type: Message.MessageTypes; text: string[]; key: string }) {
    super({ type: payload.type, key: payload.key })
    this.payload = { text: payload.text }
    this._tsx = this.CreateTsx()
  }

  protected CreateTsx(): JSX.Element {
    return (
      <MessagesElement key={this.key}>
        {this.payload.text.map((element, index) => (
          <UI.RegularText key={this.key + '__' + index.toString()}>{element}</UI.RegularText>
        ))}
      </MessagesElement>
    )
  }
}

export namespace Description {
  export interface IDescription extends Message.IMessage {
    payload: IPayload
  }

  export interface IPayload {
    text: string[]
  }
}
