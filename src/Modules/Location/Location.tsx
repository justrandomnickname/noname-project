import React from 'react'
import ERROR from '../../assembly/Error'
import UI from '@UI/index'
import { DescriptionElement, DialogContainer, DialogAction } from '../Hideout/views/Hideout'

export class Location implements Location.ILocation {
  public messages: Location.IMessage[] = []
  private setState: React.Dispatch<React.SetStateAction<JSX.Element[]>>
  constructor(setState: React.Dispatch<React.SetStateAction<JSX.Element[]>>) {
    this.setState = setState
  }

  private PushMessage(message: Location.IMessage): void {
    if (message.key !== this.messages.length + 1)
      throw Error(new ERROR('@Location/Location', 'Invalid key for message').VALUE())
    this.messages.push(message)
    this.setState(state => [...state, message.tsx])
  }

  private GetPublicKey(): number {
    let key = this.messages.length + 1
    let iterateAgain = true
    while (iterateAgain) {
      iterateAgain = false
      this.messages.forEach(message => {
        if (message.key === key) {
          key = Math.floor(Math.random() * 9500)
          iterateAgain = true
        }
      })
    }
    return key
  }

  public CreateDescriptionMessage(text: string): void {
    const key = this.GetPublicKey()
    const message: Location.IMessage = {
      type: 'description',
      key,
      tsx: (
        <DescriptionElement key={key}>
          <UI.RegularText>{text}</UI.RegularText>
        </DescriptionElement>
      ),
    }
    this.PushMessage(message)
  }

  public CreateDialogMessage(text: string, avatar: string): void {
    const key = this.GetPublicKey()
    const message: Location.IMessage = {
      type: 'dialog',
      key,
      tsx: (
        <DescriptionElement key={key}>
          <DialogContainer>
            <img src={avatar} />
            <DialogAction>
              <UI.GrandText>{text}</UI.GrandText>
            </DialogAction>
          </DialogContainer>
        </DescriptionElement>
      ),
    }
    this.PushMessage(message)
  }
}

export namespace Location {
  export interface ILocation {
    messages: IMessage[]
    CreateDescriptionMessage(text: string): void
  }

  export interface IMessage {
    type: MessageTypes
    key: number
    tsx: JSX.Element
  }

  export type MessageTypes = 'dialog' | 'description'
}
