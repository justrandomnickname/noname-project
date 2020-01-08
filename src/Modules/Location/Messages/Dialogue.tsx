import React from 'react'
import { Message } from './Message'
import { MessagesElement, DialogAction, DialogContainer } from '@Modules/Hideout/components/styled'
import UI from '@UI/index'

export class Dialogue extends Message implements Dialogue.IDialogue {
  public payload: Dialogue.IPayload
  protected _tsx: JSX.Element
  constructor(payload: { type: Message.MessageTypes; text: string; key: string; pawn: { pic: string } }) {
    super({ type: payload.type, key: payload.key })
    this.payload = { text: payload.text, pawn: payload.pawn }
    this._tsx = this.CreateTsx()
  }

  protected CreateTsx(): JSX.Element {
    return (
      <MessagesElement key={this.key}>
        <DialogContainer>
          <img src={this.payload.pawn.pic} />
          <DialogAction>
            <UI.GrandText>{this.payload.text}</UI.GrandText>
          </DialogAction>
        </DialogContainer>
      </MessagesElement>
    )
  }
}

export namespace Dialogue {
  export interface IDialogue extends Message.IMessage {
    payload: IPayload
  }
  export interface IPayload {
    text: string
    pawn: {
      pic: string
    }
  }
}
